const Dashboard = () => {
  // Later we can protect this with auth
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <div className="font-bold text-xl">Dashboard</div>
          <button className="text-sm border border-slate-700 px-3 py-1 rounded-md hover:bg-slate-800">
            Log out
          </button>
        </header>

        <main>
          <h1 className="text-3xl font-bold mb-4">
            Application overview
          </h1>
          <p className="text-slate-300 mb-6">
            Here you can see a summary of your universities, scholarships, and
            upcoming deadlines.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold mb-1">Universities</h2>
              <p className="text-3xl font-bold">3</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold mb-1">Active applications</h2>
              <p className="text-3xl font-bold">5</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold mb-1">Upcoming deadlines</h2>
              <p className="text-3xl font-bold">2</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
