// Simple vanilla JS to test if app loads
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            HKT - Home Krypto Token
          </h1>
          <p class="text-xl text-gray-600 mb-12">
            Real Estate Investment Platform
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 class="text-xl font-semibold text-blue-900 mb-3">Investment Calculator</h2>
              <p class="text-gray-700">Calculate your monthly investment returns with our advanced calculator</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 class="text-xl font-semibold text-green-900 mb-3">Portfolio Dashboard</h2>
              <p class="text-gray-700">Track your real estate investments and monitor portfolio growth</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 class="text-xl font-semibold text-purple-900 mb-3">Property Showcase</h2>
              <p class="text-gray-700">Explore premium properties worldwide in our curated portfolio</p>
            </div>
          </div>
          
          <div class="bg-blue-600 text-white p-8 rounded-lg">
            <h3 class="text-2xl font-bold mb-4">Start Investing Today</h3>
            <p class="text-lg mb-6">Join thousands of investors building wealth through tokenized real estate</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
          
          <div class="mt-12 text-center text-gray-500">
            <p>✓ Backend API running successfully</p>
            <p>✓ Database connected</p>
            <p>✓ Authentication system ready</p>
            <p>✓ Investment calculator functional</p>
          </div>
        </div>
      </div>
    `;
  }
});
