import React, { useState } from 'react';
import { Service } from '../../types';
import {
  Plus,
  Edit2,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface AdminServicesProps {
  services: Service[];
  onCreateService: (service: Omit<Service, 'id' | 'created_at'>) => Promise<void>;
  onUpdateService: (id: string, updates: Partial<Service>) => Promise<void>;
}

export const AdminServices: React.FC<AdminServicesProps> = ({
  services,
  onCreateService,
  onUpdateService,
}) => {
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [price, setPrice] = useState('150.00');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Open modal for new service
  const handleOpenAddModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setDurationMinutes(45);
    setPrice('150.00');
    setIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal for editing existing service
  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setDurationMinutes(service.duration_minutes);
    setPrice(Number(service.price).toFixed(2));
    setIsActive(service.is_active);
    setFormError(null);
    setModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter a clinical service name.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Please enter a valid non-negative price.');
      return;
    }

    if (!durationMinutes || durationMinutes <= 0) {
      setFormError('Duration must be at least 5 minutes.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingService) {
        // Update existing service in Supabase
        await onUpdateService(editingService.id, {
          name: name.trim(),
          description: description.trim(),
          duration_minutes: Number(durationMinutes),
          price: parsedPrice,
          is_active: isActive,
        });
      } else {
        // Create new service in Supabase
        await onCreateService({
          name: name.trim(),
          description: description.trim(),
          duration_minutes: Number(durationMinutes),
          price: parsedPrice,
          is_active: isActive,
        });
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
      setFormError('Failed to save service. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active/inactive directly on row
  const handleToggleActive = async (service: Service) => {
    await onUpdateService(service.id, { is_active: !service.is_active });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dental Care Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure clinical offerings, appointment durations, pricing, and public booking availability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 transition-all flex items-center gap-2 shadow-sm shadow-teal-600/25 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dental Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Service Details</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Standard Fee</th>
                <th className="py-3 px-4">Booking Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    !service.is_active ? 'bg-slate-50/40 text-slate-400' : ''
                  }`}
                >
                  {/* Name and Description */}
                  <td className="py-4 px-4 max-w-sm">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          service.is_active
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div
                          className={`font-bold leading-snug ${
                            service.is_active ? 'text-slate-900' : 'text-slate-500'
                          }`}
                        >
                          {service.name}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{service.duration_minutes} mins</span>
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 tabular-nums">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className="inline-flex items-center gap-2 group text-xs font-medium cursor-pointer"
                      title={service.is_active ? 'Click to deactivate' : 'Click to activate'}
                    >
                      {service.is_active ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-teal-600" />
                          <span className="text-teal-700 font-semibold">Active (Bookable)</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                          <span className="text-slate-400 font-medium">Inactive (Hidden)</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingService ? 'Edit Dental Service' : 'Add New Dental Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-800">
                  Clinical Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ultrasonic Periodontal Therapy"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-800">
                  Patient Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the procedure entails, benefits, and patient comfort features..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                />
              </div>

              {/* Duration and Price in 2 cols */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={240}
                    step={5}
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all tabular-nums"
                  />
                  <span className="text-[11px] text-slate-400">Controls time slot calculation</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Standard Fee (USD $) *
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="180.00"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all tabular-nums"
                  />
                  <span className="text-[11px] text-slate-400">Displayed on public booking</span>
                </div>
              </div>

              {/* Active status checkbox */}
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="serviceActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="serviceActiveCheck" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Active (Visible on public booking page)
                </label>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 transition-all shadow-sm shadow-teal-600/25 flex items-center gap-2"
                >
                  {isSaving ? 'Saving Service...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
