import { useState } from 'react'
import './App.css'
const MODELS = [
  'gpt-4',
  'gpt-4-32k',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k'
];
const API_BASE = import.meta.env.VITE_API_BASE;
const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
function App() {
  const [model, setModel] = useState(MODELS[0]);
  const [messages, setMessages] = useState([{ role: 'user', content: '' }]);
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    console.log(API_BASE)

    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query Chat($model: String!, $messages: [MessageInput!]!) {
            chat(model: $model, messages: $messages)
          }`,
        variables: { model, messages }
      })
    });
    const json = await res.json();
    console.log(json, 222222)
    setResponse(json.data.chat);
  };

  const handleValidateKey = async () => {
    try {
      // console.log(import.meta.env.VITE_OPENAI_API_KEY,111)
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: '现在几点了' }],
        }),
      });

      console.log(res,'/////res')
      if (!res.ok) {
        const errText = await res.text();
        alert(`Key 无效 ❌\n状态码: ${res.status}\n返回信息: ${errText}`);
        return;
      }

      const data = await res.json();

        console.log(data,111111111)
      // alert(`Key 有效 ✅\n返回内容: ${data.choices?.[0]?.message?.content}`);
    } catch (error: any) {
      console.log('请求出错')
      // alert(`请求出错 ❌\n${error.message}`);
    }
  }
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">OpenAI Chat 测试8 {API_BASE}</h1>

      <select value={model} onChange={e => setModel(e.target.value)} className="mb-4 border p-2">
        {MODELS.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <textarea
        rows={4}
        className="w-full p-2 border mb-4"
        placeholder="Enter your message..."
        value={messages[0].content}
        onChange={e => setMessages([{ role: 'user', content: e.target.value }])}
      />

      <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>

      <button onClick={handleValidateKey} className="px-4 py-2 bg-blue-600 text-white rounded">测试key</button>
      {response && <div className="mt-4 p-2 border bg-gray-100 whitespace-pre-wrap">{response}</div>}
    </div>
  )
}

export default App
