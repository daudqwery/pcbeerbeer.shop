import { useState } from 'react';
import { useStore } from '../store';
import { X, Plus, Trash2, Sparkles, Info, AlertCircle } from 'lucide-react';
import { PaymentGatewayConfig } from '../types';
import toast from '../utils/toast';

interface AddCustomGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['💳', '🟢', '🔵', '🟡', '🟠', '🟣', '🔴', '🟩', '🟦', '🟧', '🟪', '🟥', '⚡', '💚', '💙', '🧱', '🏦', '💰', '💵', '🎯', '🌟', '🚀', '🔥', '✨'];

export default function AddCustomGatewayModal({ isOpen, onClose }: AddCustomGatewayModalProps) {
  const { addCustomPaymentGateway, paymentGateways } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    logo: '💳',
    fees: '',
    mode: 'sandbox' as 'sandbox' | 'production',
    enabled: false,
    webhookUrl: '',
    callbackUrl: '',
  });

  // Standard fields (checkboxes)
  const [enabledFields, setEnabledFields] = useState({
    merchantId: true,
    apiKey: true,
    secretKey: true,
    serverKey: false,
    clientKey: false,
    publicKey: false,
    privateKey: false,
  });

  // Custom fields (dynamic)
  const [customFields, setCustomFields] = useState<Array<{ key: string; label: string }>>([]);
  const [newCustomField, setNewCustomField] = useState('');

  // Supported methods
  const [supportedMethods, setSupportedMethods] = useState<string[]>([]);
  const [newMethod, setNewMethod] = useState('');

  const COMMON_METHODS = ['Kartu Kredit', 'BCA VA', 'Mandiri VA', 'BNI VA', 'BRI VA', 'Permata VA', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja', 'QRIS', 'Indomaret', 'Alfamart', 'Direct Debit', 'PayLater', 'BI-FAST', 'Cicilan'];

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setFormData({
      id: '',
      name: '',
      description: '',
      logo: '💳',
      fees: '',
      mode: 'sandbox',
      enabled: false,
      webhookUrl: '',
      callbackUrl: '',
    });
    setEnabledFields({
      merchantId: true,
      apiKey: true,
      secretKey: true,
      serverKey: false,
      clientKey: false,
      publicKey: false,
      privateKey: false,
    });
    setCustomFields([]);
    setSupportedMethods([]);
    setNewCustomField('');
    setNewMethod('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateIdFromName = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      id: prev.id || generateIdFromName(name),
    }));
  };

  const addCustomField = () => {
    if (!newCustomField.trim()) return;
    const key = newCustomField.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (customFields.some(f => f.key === key)) {
      toast.error('Field dengan nama ini sudah ada');
      return;
    }
    setCustomFields([...customFields, { key, label: newCustomField.trim() }]);
    setNewCustomField('');
  };

  const removeCustomField = (key: string) => {
    setCustomFields(customFields.filter(f => f.key !== key));
  };

  const toggleMethod = (method: string) => {
    if (supportedMethods.includes(method)) {
      setSupportedMethods(supportedMethods.filter(m => m !== method));
    } else {
      setSupportedMethods([...supportedMethods, method]);
    }
  };

  const addCustomMethod = () => {
    if (!newMethod.trim() || supportedMethods.includes(newMethod.trim())) return;
    setSupportedMethods([...supportedMethods, newMethod.trim()]);
    setNewMethod('');
  };

  const removeMethod = (method: string) => {
    setSupportedMethods(supportedMethods.filter(m => m !== method));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error('Nama gateway harus diisi');
        return false;
      }
      if (!formData.id.trim()) {
        toast.error('ID gateway harus diisi');
        return false;
      }
      if (!/^[a-z0-9_-]+$/.test(formData.id)) {
        toast.error('ID hanya boleh huruf kecil, angka, underscore, dan dash');
        return false;
      }
      if (paymentGateways[formData.id]) {
        toast.error(`Gateway dengan ID "${formData.id}" sudah ada. Gunakan ID lain.`);
        return false;
      }
      if (!formData.description.trim()) {
        toast.error('Deskripsi harus diisi');
        return false;
      }
    }
    if (step === 2) {
      const hasAnyField = Object.values(enabledFields).some(v => v) || customFields.length > 0;
      if (!hasAnyField) {
        toast.error('Pilih minimal 1 credential field');
        return false;
      }
    }
    if (step === 3) {
      if (supportedMethods.length === 0) {
        toast.error('Pilih minimal 1 metode pembayaran');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    // Build the new gateway config
    const newGateway: PaymentGatewayConfig = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      logo: formData.logo,
      enabled: formData.enabled,
      mode: formData.mode,
      fees: formData.fees || 'Custom',
      supportedMethods,
      webhookUrl: formData.webhookUrl || `https://yourdomain.com/api/webhooks/${formData.id}`,
      callbackUrl: formData.callbackUrl || `https://yourdomain.com/api/callbacks/${formData.id}`,
    };

    // Add standard fields based on selection
    if (enabledFields.merchantId) newGateway.merchantId = '';
    if (enabledFields.apiKey) newGateway.apiKey = '';
    if (enabledFields.secretKey) newGateway.secretKey = '';
    if (enabledFields.serverKey) newGateway.serverKey = '';
    if (enabledFields.clientKey) newGateway.clientKey = '';
    if (enabledFields.publicKey) newGateway.publicKey = '';
    if (enabledFields.privateKey) newGateway.privateKey = '';

    // Add custom fields
    if (customFields.length > 0) {
      newGateway.customFields = customFields.reduce((acc, field) => {
        acc[field.key] = '';
        return acc;
      }, {} as Record<string, string>);
    }

    addCustomPaymentGateway(newGateway);
    toast.success(`✅ Payment Gateway "${formData.name}" berhasil ditambahkan!`);
    handleClose();
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Tambah Payment Gateway Custom</h2>
              <p className="text-xs text-gray-500">Step {step} dari 3</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`flex-1 h-2 rounded-full transition ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>1. Info Dasar</span>
            <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>2. Credentials</span>
            <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>3. Metode Bayar</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Info Dasar */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  Isi informasi dasar tentang payment gateway baru yang akan diintegrasikan.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Gateway <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Tripay, Winpay, Prismalink, Saladin Pay, dll"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Gateway <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-gray-400">(unik, lowercase, no spaces)</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  placeholder="contoh: tripay, winpay, custompay"
                  className={`${inputClass} font-mono`}
                />
                <p className="text-xs text-gray-400 mt-1">ID tidak bisa diubah setelah dibuat</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang payment gateway ini..."
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo / Icon Gateway
                </label>
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-xl">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, logo: emoji })}
                      className={`text-2xl p-2 rounded-lg transition ${
                        formData.logo === emoji
                          ? 'bg-blue-500 ring-2 ring-blue-300'
                          : 'hover:bg-white'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Atau ketik custom emoji:</span>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    maxLength={4}
                    className="w-20 px-3 py-1 border border-gray-200 rounded-lg text-center text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biaya Transaksi (opsional)
                </label>
                <input
                  type="text"
                  value={formData.fees}
                  onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                  placeholder="Contoh: 2.9% + Rp 2.000 atau Rp 4.000 per transaksi"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Step 2: Credentials */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  Pilih field credential yang dibutuhkan oleh gateway ini sesuai dokumentasi resminya. 
                  Semua field bisa diisi nanti di pengaturan.
                </p>
              </div>

              {/* Standard Fields */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Standard Credential Fields
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'merchantId', label: 'Merchant ID', desc: 'ID unik merchant dari provider' },
                    { key: 'apiKey', label: 'API Key', desc: 'Public API Key untuk frontend' },
                    { key: 'secretKey', label: 'Secret Key 🔒', desc: 'Secret Key untuk backend (sensitive)' },
                    { key: 'serverKey', label: 'Server Key 🔒', desc: 'Khusus Midtrans-style API' },
                    { key: 'clientKey', label: 'Client Key', desc: 'Untuk frontend SDK' },
                    { key: 'publicKey', label: 'Public Key', desc: 'Public key identifikasi merchant' },
                    { key: 'privateKey', label: 'Private Key 🔒', desc: 'Private key untuk signature' },
                  ].map((field) => (
                    <label
                      key={field.key}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                        enabledFields[field.key as keyof typeof enabledFields]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={enabledFields[field.key as keyof typeof enabledFields]}
                        onChange={(e) => setEnabledFields({ ...enabledFields, [field.key]: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-800">{field.label}</div>
                        <div className="text-xs text-gray-500">{field.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Custom Fields (Opsional)
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    Untuk field khusus yang tidak ada di standard
                  </span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newCustomField}
                    onChange={(e) => setNewCustomField(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomField())}
                    placeholder="Contoh: Terminal ID, Signature Key, Channel Code"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {customFields.length > 0 ? (
                  <div className="space-y-2">
                    {customFields.map((field) => (
                      <div key={field.key} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{field.label}</div>
                          <div className="text-xs text-gray-500 font-mono">key: {field.key}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomField(field.key)}
                          className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Belum ada custom field. Tambahkan jika diperlukan.</p>
                )}
              </div>

              {/* Webhook URLs */}
              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Webhook URLs (Opsional)
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Webhook / Notification URL</label>
                    <input
                      type="text"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                      placeholder={`https://yourdomain.com/api/webhooks/${formData.id || 'gateway'}`}
                      className={`${inputClass} font-mono text-xs`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Callback / Redirect URL</label>
                    <input
                      type="text"
                      value={formData.callbackUrl}
                      onChange={(e) => setFormData({ ...formData, callbackUrl: e.target.value })}
                      placeholder={`https://yourdomain.com/api/callbacks/${formData.id || 'gateway'}`}
                      className={`${inputClass} font-mono text-xs`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Supported Methods */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800">
                  Pilih metode pembayaran yang didukung oleh gateway ini. 
                  Anda juga bisa menambahkan metode custom.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Metode Pembayaran Umum
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_METHODS.map((method) => {
                    const isSelected = supportedMethods.includes(method);
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => toggleMethod(method)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Tambah Metode Custom
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMethod())}
                    placeholder="Contoh: Akulaku, Kredivo, BSI VA, Atome"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCustomMethod}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              {/* Selected Methods Preview */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-xs font-bold text-gray-600 mb-2">
                  Metode Terpilih ({supportedMethods.length})
                </h4>
                {supportedMethods.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Belum ada metode pembayaran terpilih</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {supportedMethods.map((method) => (
                      <span
                        key={method}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-md text-xs"
                      >
                        {method}
                        <button
                          type="button"
                          onClick={() => removeMethod(method)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Final Settings */}
              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Pengaturan Akhir
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                    <div>
                      <div className="font-semibold text-sm text-gray-800">Aktifkan Sekarang?</div>
                      <div className="text-xs text-gray-500">Gateway akan langsung muncul di halaman checkout</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Mode Awal</label>
                    <div className="flex gap-2">
                      {(['sandbox', 'production'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setFormData({ ...formData, mode })}
                          className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition border-2 ${
                            formData.mode === mode
                              ? mode === 'production'
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 text-gray-500'
                          }`}
                        >
                          {mode === 'production' ? '🔴 Production' : '🟡 Sandbox'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">📋 Preview Gateway</h4>
                <div className="p-4 bg-white border-2 border-blue-200 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                      {formData.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{formData.name || 'Nama Gateway'}</h3>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                          CUSTOM
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formData.description || 'Deskripsi gateway...'}</p>
                    </div>
                  </div>
                  {supportedMethods.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {supportedMethods.slice(0, 6).map(m => (
                        <span key={m} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{m}</span>
                      ))}
                      {supportedMethods.length > 6 && (
                        <span className="text-[10px] text-gray-400 px-2 py-0.5">+{supportedMethods.length - 6} lainnya</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between gap-3 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            type="button"
            onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : handleClose()}
            className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition"
          >
            {step === 1 ? 'Batal' : '← Kembali'}
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/30"
            >
              Selanjutnya →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-500/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Buat Gateway
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
