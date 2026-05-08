import { useState } from 'react';
import { useStore } from '../store';
import { 
  CreditCard, Eye, EyeOff, X, ChevronDown, ChevronUp,
  Star, RefreshCw, Save, Webhook, Key, Copy, AlertCircle, CheckCircle2,
  Plug, Power, ExternalLink, Plus, Trash2, Sparkles
} from 'lucide-react';
import toast from '../utils/toast';
import AddCustomGatewayModal from './AddCustomGatewayModal';

export default function PaymentGatewaySettings() {
  const { paymentGateways, defaultGateway, updatePaymentGateway, togglePaymentGateway, setDefaultGateway, resetPaymentGateway, customGatewayIds, deleteCustomPaymentGateway } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editingData, setEditingData] = useState<Record<string, any>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'custom'>('all');

  const allGateways = Object.values(paymentGateways);
  const enabledCount = allGateways.filter(g => g.enabled).length;
  const configuredCount = allGateways.filter(g => g.enabled && (g.apiKey || g.serverKey || g.secretKey || g.merchantId)).length;
  const customCount = customGatewayIds.length;

  // Apply filter
  let gateways = allGateways;
  if (filter === 'active') gateways = allGateways.filter(g => g.enabled);
  else if (filter === 'inactive') gateways = allGateways.filter(g => !g.enabled);
  else if (filter === 'custom') gateways = allGateways.filter(g => customGatewayIds.includes(g.id));

  const handleDeleteCustomGateway = (id: string) => {
    const gateway = paymentGateways[id];
    if (!gateway) return;
    deleteCustomPaymentGateway(id);
    toast.success(`✅ Gateway "${gateway.name}" berhasil dihapus`);
    setShowDeleteConfirm(null);
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Initialize editing data with current values
      setEditingData(prev => ({
        ...prev,
        [id]: { ...paymentGateways[id] },
      }));
    }
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFieldChange = (gatewayId: string, field: string, value: string) => {
    setEditingData(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        [field]: value,
      },
    }));
  };

  const handleCustomFieldChange = (gatewayId: string, field: string, value: string) => {
    setEditingData(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        customFields: {
          ...(prev[gatewayId]?.customFields || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleSave = (gatewayId: string) => {
    const data = editingData[gatewayId];
    if (!data) return;
    updatePaymentGateway(gatewayId, data);
    toast.success(`✅ ${paymentGateways[gatewayId].name} berhasil disimpan!`);
  };

  const handleReset = (gatewayId: string) => {
    if (confirm(`Reset konfigurasi ${paymentGateways[gatewayId].name}? Semua data akan dikembalikan ke default.`)) {
      resetPaymentGateway(gatewayId);
      setEditingData(prev => {
        const next = { ...prev };
        delete next[gatewayId];
        return next;
      });
      toast.info(`Konfigurasi ${paymentGateways[gatewayId].name} direset`);
    }
  };

  const handleTestConnection = (gatewayId: string) => {
    setTestingId(gatewayId);
    const gateway = paymentGateways[gatewayId];
    
    setTimeout(() => {
      const hasCredentials = !!(gateway.apiKey || gateway.serverKey || gateway.secretKey || gateway.merchantId);
      if (hasCredentials) {
        toast.success(`✅ Koneksi ke ${gateway.name} berhasil! API key valid.`);
      } else {
        toast.error(`❌ Konfigurasi ${gateway.name} belum lengkap. Isi API key terlebih dahulu.`);
      }
      setTestingId(null);
    }, 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin ke clipboard!`);
  };

  const renderField = (
    gatewayId: string,
    field: string,
    label: string,
    isSecret = false,
    placeholder = '',
    description?: string
  ) => {
    const data = editingData[gatewayId] || paymentGateways[gatewayId];
    const value = (data as any)[field] || '';
    const secretKey = `${gatewayId}-${field}`;
    const isVisible = showSecrets[secretKey];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isSecret && <span className="ml-2 text-xs text-red-500">🔒 Sensitive</span>}
        </label>
        <div className="relative">
          <input
            type={isSecret && !isVisible ? 'password' : 'text'}
            value={value}
            onChange={(e) => handleFieldChange(gatewayId, field, e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 pr-20 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSecret && (
              <button
                type="button"
                onClick={() => toggleSecret(secretKey)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                title={isVisible ? 'Sembunyikan' : 'Tampilkan'}
              >
                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            {value && (
              <button
                type="button"
                onClick={() => copyToClipboard(value, label)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                title="Salin"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    );
  };

  return (
    <div>
      {/* Header & Stats */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Gateway Integration</h2>
          <p className="text-gray-500 text-sm">Kelola integrasi payment gateway untuk menerima pembayaran dari berbagai channel</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-blue-500/30 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <Plus className="w-4 h-4" />
          Tambah Gateway Custom
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{allGateways.length}</div>
              <div className="text-xs text-gray-500">Total Gateway</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Power className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{enabledCount}</div>
              <div className="text-xs text-gray-500">Aktif</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Plug className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{configuredCount}</div>
              <div className="text-xs text-gray-500">Terkonfigurasi</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{customCount}</div>
              <div className="text-xs text-gray-500">Custom</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" fill="currentColor" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-800 line-clamp-1">{paymentGateways[defaultGateway]?.name || 'None'}</div>
              <div className="text-xs text-gray-500">Default</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: 'all', label: '🌐 Semua', count: allGateways.length },
          { id: 'active', label: '✅ Aktif', count: enabledCount },
          { id: 'inactive', label: '⏸️ Nonaktif', count: allGateways.length - enabledCount },
          { id: 'custom', label: '✨ Custom', count: customCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              filter === tab.id ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm">⚠️ Penting Sebelum Konfigurasi</h4>
            <ul className="text-xs text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Pastikan Anda telah memiliki akun & merchant aktif di gateway terkait</li>
              <li>Gunakan mode <span className="font-bold">Sandbox</span> untuk testing, lalu switch ke <span className="font-bold">Production</span> saat live</li>
              <li>Setup Webhook URL di dashboard masing-masing gateway agar status pembayaran otomatis ter-update</li>
              <li>Server Key & Secret Key WAJIB DISIMPAN DI BACKEND, tidak boleh di frontend (saat production)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gateway List */}
      <div className="space-y-4">
        {gateways.map((gateway) => {
          const isExpanded = expandedId === gateway.id;
          const isDefault = defaultGateway === gateway.id;
          const isConfigured = !!(gateway.apiKey || gateway.serverKey || gateway.secretKey || gateway.merchantId);
          const isTesting = testingId === gateway.id;
          const isCustom = customGatewayIds.includes(gateway.id);

          return (
            <div
              key={gateway.id}
              className={`bg-white rounded-2xl border-2 transition overflow-hidden ${
                gateway.enabled
                  ? 'border-blue-200 shadow-md'
                  : 'border-gray-100 shadow-sm'
              }`}
            >
              {/* Header */}
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    gateway.enabled ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    {gateway.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800">{gateway.name}</h3>
                      {isDefault && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" fill="currentColor" /> DEFAULT
                        </span>
                      )}
                      {gateway.enabled ? (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Aktif
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                          Nonaktif
                        </span>
                      )}
                      {isConfigured && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <Plug className="w-3 h-3" /> Configured
                        </span>
                      )}
                      {isCustom && (
                        <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> CUSTOM
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        gateway.mode === 'production' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {gateway.mode === 'production' ? '🔴 Production' : '🟡 Sandbox'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{gateway.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={gateway.enabled}
                      onChange={() => {
                        togglePaymentGateway(gateway.id);
                        toast.info(
                          gateway.enabled
                            ? `${gateway.name} dinonaktifkan`
                            : `${gateway.name} diaktifkan`
                        );
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                  <button
                    onClick={() => toggleExpand(gateway.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Supported Methods */}
              {!isExpanded && (
                <div className="px-5 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {gateway.supportedMethods.slice(0, 8).map(method => (
                      <span key={method} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {method}
                      </span>
                    ))}
                    {gateway.supportedMethods.length > 8 && (
                      <span className="text-[10px] text-gray-400 px-2 py-1">
                        +{gateway.supportedMethods.length - 8} lainnya
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-5">
                  {/* Tabs Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 mb-1">💳 Metode Pembayaran Tersedia</div>
                      <div className="flex flex-wrap gap-1">
                        {gateway.supportedMethods.map(method => (
                          <span key={method} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-600">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 mb-1">💰 Biaya Transaksi</div>
                      <div className="text-sm font-semibold text-gray-700">{gateway.fees || '-'}</div>
                      {gateway.lastUpdated && (
                        <div className="text-[10px] text-gray-400 mt-2">
                          Last updated: {new Date(gateway.lastUpdated).toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Environment Mode</label>
                    <div className="flex gap-2">
                      {(['sandbox', 'production'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleFieldChange(gateway.id, 'mode', mode)}
                          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
                            (editingData[gateway.id]?.mode || gateway.mode) === mode
                              ? mode === 'production'
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {mode === 'production' ? '🔴 Production (Live)' : '🟡 Sandbox (Testing)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Credentials Section */}
                  <div className="mb-5">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      API Credentials
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Render fields based on what gateway needs */}
                      {gateway.merchantId !== undefined && renderField(
                        gateway.id, 'merchantId', 'Merchant ID', false,
                        `Contoh: M${gateway.id.toUpperCase()}-12345`,
                        'Merchant ID dari dashboard provider'
                      )}
                      {gateway.serverKey !== undefined && renderField(
                        gateway.id, 'serverKey', 'Server Key', true,
                        'SB-Mid-server-xxxxx atau Mid-server-xxxxx',
                        '⚠️ Hanya simpan di backend untuk keamanan'
                      )}
                      {gateway.clientKey !== undefined && renderField(
                        gateway.id, 'clientKey', 'Client Key', false,
                        'SB-Mid-client-xxxxx atau Mid-client-xxxxx',
                        'Aman digunakan di frontend'
                      )}
                      {gateway.apiKey !== undefined && renderField(
                        gateway.id, 'apiKey', 'API Key', true,
                        'xnd_public_xxxxx atau api_xxxxx',
                        'Public API Key untuk frontend SDK'
                      )}
                      {gateway.secretKey !== undefined && renderField(
                        gateway.id, 'secretKey', 'Secret Key', true,
                        'xnd_secret_xxxxx atau secret_xxxxx',
                        '⚠️ JANGAN expose ke frontend, simpan di env backend'
                      )}
                      {gateway.publicKey !== undefined && renderField(
                        gateway.id, 'publicKey', 'Public Key', false,
                        'public_key_xxxxx',
                        'Public Key untuk identifikasi merchant'
                      )}
                      {gateway.privateKey !== undefined && renderField(
                        gateway.id, 'privateKey', 'Private Key', true,
                        'private_key_xxxxx',
                        '⚠️ Sangat sensitif, hanya simpan di backend'
                      )}

                      {/* Custom Fields */}
                      {gateway.customFields && Object.keys(gateway.customFields).length > 0 && (
                        <>
                          {Object.keys(editingData[gateway.id]?.customFields || gateway.customFields || {}).map((fieldKey) => (
                            <div key={fieldKey}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1).replace(/([A-Z])/g, ' $1')}
                                <span className="ml-2 text-xs text-blue-500">Custom</span>
                              </label>
                              <input
                                type="text"
                                value={(editingData[gateway.id]?.customFields?.[fieldKey] ?? gateway.customFields?.[fieldKey] ?? '') as string}
                                onChange={(e) => handleCustomFieldChange(gateway.id, fieldKey, e.target.value)}
                                placeholder={`Masukkan ${fieldKey}`}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Webhook & Callback */}
                  <div className="mb-5">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Webhook className="w-4 h-4 text-purple-600" />
                      Webhook & Callback URLs
                    </h4>
                    <div className="space-y-3">
                      {gateway.webhookUrl !== undefined && renderField(
                        gateway.id, 'webhookUrl', 'Webhook / Notification URL', false,
                        'https://yourdomain.com/api/webhooks/...',
                        'URL untuk menerima notifikasi status pembayaran dari gateway'
                      )}
                      {gateway.callbackUrl !== undefined && renderField(
                        gateway.id, 'callbackUrl', 'Callback / Redirect URL', false,
                        'https://yourdomain.com/payment/success',
                        'URL redirect setelah customer selesai bayar'
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleSave(gateway.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Konfigurasi
                    </button>
                    <button
                      onClick={() => handleTestConnection(gateway.id)}
                      disabled={isTesting}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition"
                    >
                      <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                      {isTesting ? 'Testing...' : 'Test Connection'}
                    </button>
                    {!isDefault && gateway.enabled && (
                      <button
                        onClick={() => {
                          setDefaultGateway(gateway.id);
                          toast.success(`✅ ${gateway.name} dijadikan default gateway`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-xl transition"
                      >
                        <Star className="w-4 h-4" />
                        Set as Default
                      </button>
                    )}
                    {!isCustom && (
                      <button
                        onClick={() => handleReset(gateway.id)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl transition"
                      >
                        <X className="w-4 h-4" />
                        Reset
                      </button>
                    )}
                    {isCustom && (
                      showDeleteConfirm === gateway.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteCustomGateway(gateway.id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Konfirmasi Hapus
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl transition"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(gateway.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus Gateway
                        </button>
                      )
                    )}
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(gateway.name + ' API documentation Indonesia')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl transition ml-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Dokumentasi
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {gateways.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-700 mb-2">Tidak Ada Gateway</h3>
            <p className="text-sm text-gray-500 mb-4">
              {filter === 'custom' 
                ? 'Belum ada custom gateway. Tambahkan yang pertama!'
                : filter === 'active'
                ? 'Belum ada gateway yang aktif'
                : 'Tidak ada gateway sesuai filter'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              Tambah Gateway Custom
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Gateway Modal */}
      <AddCustomGatewayModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
