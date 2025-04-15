const SettingsBar = ({
  selectedModel,
  setSelectedModel,
  selectedMethod,
  setSelectedMethod,
  isTeacher,
}: {
  selectedModel: string;
  setSelectedModel: (model: string) => Promise<void>;
  selectedMethod: string;
  setSelectedMethod: (method: string) => Promise<void>;
  isTeacher: boolean;
}) => {
  return (
    <div className='sticky top-4 z-10 p-4 bg-white border-t flex gap-4 shadow-md rounded-2xl'>
      {isTeacher ? (
        <>
          {/* AI Model Selector */}
          <div className='flex-1'>
            {selectedMethod === 'direct' ? (
              <select
                className='w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700'
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value='chatgpt'>ChatGPT</option>
                <option value='gemini'>Gemini</option>
                <option value='llama3'>Llama 3.1</option>
              </select>
            ) : (
              <div className='w-full p-3 rounded-lg bg-gray-50 text-gray-600 text-sm'>
                Model selection disabled
              </div>
            )}
          </div>

          {/* Method Selector */}
          <div className='flex-1'>
            <select
              className='w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700'
              value={selectedMethod}
              onChange={async (e) => {
                const newMethod = e.target.value;
                await setSelectedMethod(newMethod);
                if (newMethod !== 'direct') await setSelectedModel('chatgpt');
              }}
            >
              <option value='direct'>Direct</option>
              <option value='multi-agent'>Multi-Agent</option>
              <option value='rag'>RAG</option>
              <option value='combined'>Combined</option>
            </select>
          </div>
        </>
      ) : (
        <div className='w-full text-sm text-gray-600'>
          <div className='p-3 rounded-lg bg-gray-50'>
            <strong>Model:</strong> {selectedModel} &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong>Method:</strong> {selectedMethod}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsBar;