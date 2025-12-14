// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎉 Scroll Waitlist Exchange
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with Next.js + TypeScript + Tailwind CSS
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ✅ Tailwind Plugins Installed & Working
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-blue-600 mb-4">@tailwindcss/forms</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Better form styling"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </form>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-purple-600 mb-4">@tailwindcss/typography</h3>
              <div className="prose">
                <h4>Beautiful Typography</h4>
                <p>All HTML elements styled beautifully.</p>
              </div>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-green-600 mb-4">tailwindcss-animate</h3>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg animate-pulse">
                Animated Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}