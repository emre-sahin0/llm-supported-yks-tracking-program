import { SparklesIcon } from '@heroicons/react/24/solid';

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* AI Danışman Kartı */}
  <div className="relative bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-indigo-100">
    <div className="absolute -top-5 -right-5 bg-indigo-500 rounded-full p-3 shadow-lg">
      <SparklesIcon className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-2xl font-extrabold text-indigo-800 mb-6 tracking-tight flex items-center gap-2">
      AI Danışman
    </h3>
    <div className="space-y-6">
      <div className="bg-white/80 rounded-xl p-5 shadow-inner min-h-[64px] flex items-center">
        <p className="text-gray-800 text-lg font-medium">{aiRecommendations || 'AI danışman yükleniyor...'}</p>
      </div>
      <button
        onClick={handleAnalyze}
        className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
      >
        <span className="inline-flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-white" /> Analiz Et
        </span>
      </button>
    </div>
  </div>
</div> 