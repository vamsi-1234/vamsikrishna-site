// components/InteractiveShowcase.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Play, RotateCcw, Zap, Clock, TrendingDown, Database, Search, Filter, Check, X, Server, Activity } from "lucide-react";

type Demo = "caching" | "search" | "batch" | "realtime";

interface DemoInfo {
  name: string;
  project: string;
  description: string;
  impact: string;
  icon: typeof Zap;
  color: string;
}

const demos: Record<Demo, DemoInfo> = {
  caching: {
    name: "Smart Caching Layer",
    project: "American Airlines - Flight API",
    description: "Implemented Redis caching for flight data, reducing database load and response times",
    impact: "~70% faster responses, 50% less DB queries",
    icon: Database,
    color: "from-blue-500 to-cyan-500",
  },
  search: {
    name: "Optimized Search Algorithm",
    project: "MaxLinear - Log Analysis Tool",
    description: "Built indexed search with pre-computed filters vs naive full-text search",
    impact: "O(log n) vs O(n) - 25% faster debugging",
    icon: Search,
    color: "from-purple-500 to-pink-500",
  },
  batch: {
    name: "Batch Processing Pipeline",
    project: "American Airlines - Data Sync",
    description: "Batch API calls with connection pooling vs individual requests",
    impact: "~60% reduction in API latency",
    icon: Filter,
    color: "from-orange-500 to-amber-500",
  },
  realtime: {
    name: "Real-time Event System",
    project: "MaxLinear - Dashboard Updates",
    description: "WebSocket-based live updates vs polling approach",
    impact: "90% less server load, instant updates",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
  },
};

// Caching Demo - Shows cache hit vs miss
function CachingDemo() {
  const [requests, setRequests] = useState<{id: number; cached: boolean; time: number; flightId: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [cache, setCache] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ hits: 0, misses: 0, avgTime: 0 });
  const [apiCalls, setApiCalls] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const simulateRequest = async (useCache: boolean) => {
    const flightIds = ["AA101", "AA202", "AA303", "AA101", "AA202", "AA101"];
    setIsRunning(true);
    setRequests([]);
    setCache(new Set());
    setStats({ hits: 0, misses: 0, avgTime: 0 });
    setApiCalls(0);
    setError(null);
    
    let hits = 0, misses = 0, totalTime = 0;
    const newCache = new Set<string>();

    for (const flightId of flightIds) {
      setApiCalls(prev => prev + 1);
      
      try {
        const response = await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "caching", useCache, flightId }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const isCached = data.cached || false;
        const time = data.responseTime || (isCached ? 15 : 150);
        
        if (isCached) {
          hits++;
        } else {
          misses++;
        }
        if (useCache) newCache.add(flightId);
        totalTime += time;

        setRequests(prev => [...prev, { id: prev.length, cached: isCached, time: Math.round(time), flightId }]);
        setCache(new Set(newCache));
        setStats({ hits, misses, avgTime: Math.round(totalTime / (hits + misses)) });
      } catch (err) {
        console.error("API call failed:", err);
        setError(err instanceof Error ? err.message : "API call failed");
        // Add fallback entry
        misses++;
        totalTime += 150;
        setRequests(prev => [...prev, { id: prev.length, cached: false, time: 150, flightId }]);
        setStats({ hits, misses, avgTime: Math.round(totalTime / (hits + misses)) });
      }
      
      await new Promise(r => setTimeout(r, 200));
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
          Error: {error}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateRequest(false)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          <X className="w-4 h-4" /> Without Cache
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateRequest(true)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          <Check className="w-4 h-4" /> With Redis Cache
        </motion.button>
      </div>

      {/* Visual representation */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-3 text-black dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" /> Cache Store
          </h4>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {Array.from(cache).map(id => (
              <motion.span
                key={id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded text-xs font-mono"
              >
                {id}
              </motion.span>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-3 text-black dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" /> Performance
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-black/60 dark:text-white/60">Cache Hits:</span>
              <span className="text-green-500 font-medium">{stats.hits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60 dark:text-white/60">Cache Misses:</span>
              <span className="text-red-500 font-medium">{stats.misses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60 dark:text-white/60">Avg Response:</span>
              <span className={`font-medium ${stats.avgTime < 50 ? 'text-green-500' : 'text-orange-500'}`}>
                {stats.avgTime}ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Request log */}
      <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs max-h-[150px] overflow-y-auto">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
          <span className="text-gray-500 flex items-center gap-1">
            <Server className="w-3 h-3" /> API: /api/demo
          </span>
          <span className="text-gray-500 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Calls: {apiCalls}
          </span>
        </div>
        {requests.length === 0 && (
          <span className="text-gray-500">// Click a button to call the backend API...</span>
        )}
        {requests.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-gray-500">[{String(i+1).padStart(2, '0')}]</span>
            <span className="text-blue-400">POST /api/demo</span>
            <span className="text-purple-400">{req.flightId}</span>
            <span className="text-gray-500">→</span>
            {req.cached ? (
              <span className="text-green-400">CACHE_HIT</span>
            ) : (
              <span className="text-yellow-400">DB_QUERY</span>
            )}
            <span className={req.cached ? "text-green-400" : "text-orange-400"}>{req.time}ms</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Search Algorithm Demo
function SearchDemo() {
  const [searchType, setSearchType] = useState<"naive" | "indexed" | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{found: boolean; time: number; comparisons: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "calling" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const logEntries = 10000;
  const targetLog = "ERROR: Connection timeout at service.auth.validate()";

  const runSearch = async (type: "naive" | "indexed") => {
    setSearchType(type);
    setIsSearching(true);
    setProgress(0);
    setResults(null);
    setApiStatus("calling");
    setError(null);

    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // Show progress animation while API is called
      progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + (type === "indexed" ? 15 : 3), 90));
      }, type === "indexed" ? 50 : 30);

      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "search", useIndexed: type === "indexed", query: targetLog }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (progressInterval) clearInterval(progressInterval);
      setProgress(100);
      setApiStatus("idle");

      setResults({
        found: data.found !== undefined ? data.found : true,
        time: data.responseTime || (type === "indexed" ? 25 : 340),
        comparisons: data.comparisons || (type === "indexed" ? 14 : 7823)
      });
    } catch (err) {
      console.error("Search API failed:", err);
      if (progressInterval) clearInterval(progressInterval);
      setProgress(100);
      setApiStatus("error");
      setError(err instanceof Error ? err.message : "Search failed");
      // Show fallback results
      setResults({
        found: true,
        time: type === "indexed" ? 25 : 340,
        comparisons: type === "indexed" ? 14 : 7823
      });
    }
    
    setIsSearching(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
          Error: {error} (showing simulated results)
        </div>
      )}
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-black dark:text-white">Search Query:</span>
        </div>
        <code className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded block">
          &quot;{targetLog}&quot;
        </code>
        <p className="text-xs text-black/50 dark:text-white/50 mt-2">
          Searching through {logEntries.toLocaleString()} log entries
        </p>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => runSearch("naive")}
          disabled={isSearching}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          O(n) Linear Search
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => runSearch("indexed")}
          disabled={isSearching}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          O(log n) Indexed Search
        </motion.button>
      </div>

      {/* Progress */}
      {isSearching && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-black/60 dark:text-white/60">
            <span className="flex items-center gap-1">
              {apiStatus === "calling" && <Activity className="w-3 h-3 animate-pulse" />}
              {apiStatus === "calling" ? "Calling /api/demo..." : "Searching..."}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${searchType === "indexed" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-red-500"}`}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
            <Check className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <span className="text-xs text-green-600 dark:text-green-400">Found</span>
          </div>
          <div className={`rounded-xl p-3 text-center ${results.time < 50 ? "bg-green-500/10 border border-green-500/30" : "bg-orange-500/10 border border-orange-500/30"}`}>
            <span className={`text-lg font-bold ${results.time < 50 ? "text-green-500" : "text-orange-500"}`}>{results.time}ms</span>
            <span className="text-xs text-black/60 dark:text-white/60 block">Time</span>
          </div>
          <div className={`rounded-xl p-3 text-center ${results.comparisons < 100 ? "bg-green-500/10 border border-green-500/30" : "bg-orange-500/10 border border-orange-500/30"}`}>
            <span className={`text-lg font-bold ${results.comparisons < 100 ? "text-green-500" : "text-orange-500"}`}>{results.comparisons.toLocaleString()}</span>
            <span className="text-xs text-black/60 dark:text-white/60 block">Comparisons</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Batch Processing Demo
function BatchDemo() {
  const [mode, setMode] = useState<"individual" | "batch" | null>(null);
  const [requests, setRequests] = useState<{id: number; status: "pending" | "done"}[]>([]);
  const [stats, setStats] = useState({ total: 0, connections: 0, totalTime: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [apiCalls, setApiCalls] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runDemo = async (useBatch: boolean) => {
    setMode(useBatch ? "batch" : "individual");
    setIsRunning(true);
    setRequests([]);
    setApiCalls(0);
    setError(null);
    setStats({ total: 0, connections: 0, totalTime: 0 });
    
    const totalRequests = 12;
    const items = Array.from({ length: totalRequests }, (_, i) => ({ id: i, status: "pending" as const }));
    setRequests(items);

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "batch", useBatch, count: totalRequests }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setApiCalls(1);
      
      const responseTime = data.responseTime || data.totalTime || (useBatch ? 300 : 1200);
      const animationDelay = Math.max(50, responseTime / (useBatch ? 3 : totalRequests));

      // Animate the completion
      if (useBatch) {
        // Batch: Process in groups
        for (let batch = 0; batch < 3; batch++) {
          await new Promise(r => setTimeout(r, animationDelay));
          setRequests(prev => prev.map((req, i) => 
            i >= batch * 4 && i < (batch + 1) * 4 ? { ...req, status: "done" } : req
          ));
          setStats(prev => ({ ...prev, total: (batch + 1) * 4 }));
        }
      } else {
        // Individual: One at a time
        for (let i = 0; i < totalRequests; i++) {
          await new Promise(r => setTimeout(r, animationDelay));
          setRequests(prev => prev.map((req, idx) => 
            idx === i ? { ...req, status: "done" } : req
          ));
          setStats(prev => ({ ...prev, total: i + 1, connections: i + 1 }));
        }
      }

      setStats(prev => ({ 
        ...prev, 
        totalTime: responseTime,
        connections: data.connections || data.connectionsUsed || (useBatch ? 1 : totalRequests)
      }));
    } catch (err) {
      console.error("Batch API failed:", err);
      setError(err instanceof Error ? err.message : "API call failed");
      // Still animate to show UI is working
      for (let i = 0; i < totalRequests; i++) {
        await new Promise(r => setTimeout(r, 100));
        setRequests(prev => prev.map((req, idx) => 
          idx === i ? { ...req, status: "done" } : req
        ));
      }
    }
    
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
          Error: {error}
        </div>
      )}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => runDemo(false)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Individual Requests
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => runDemo(true)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Batch Processing
        </motion.button>
      </div>

      {/* Visual Grid */}
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-black dark:text-white">Data Sync Operations</span>
          <span className="text-xs text-black/50 dark:text-white/50">
            {mode === "batch" ? "Batch Size: 4" : "Sequential"}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {requests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: req.status === "done" ? 1 : 0.8,
                opacity: req.status === "done" ? 1 : 0.5
              }}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                req.status === "done" 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
              }`}
            >
              {req.status === "done" ? <Check className="w-4 h-4" /> : req.id + 1}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {mode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><Server className="w-3 h-3" /> API Calls: {apiCalls}</span>
            <span>POST /api/demo</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-3 ${mode === "batch" ? "bg-green-500/10 border border-green-500/30" : "bg-orange-500/10 border border-orange-500/30"}`}>
              <span className="text-xs text-black/60 dark:text-white/60">Total Time</span>
              <span className={`text-lg font-bold block ${mode === "batch" ? "text-green-500" : "text-orange-500"}`}>
                ~{stats.totalTime || (mode === "batch" ? 900 : 2400)}ms
              </span>
            </div>
            <div className={`rounded-xl p-3 ${mode === "batch" ? "bg-green-500/10 border border-green-500/30" : "bg-orange-500/10 border border-orange-500/30"}`}>
              <span className="text-xs text-black/60 dark:text-white/60">Connections Used</span>
              <span className={`text-lg font-bold block ${mode === "batch" ? "text-green-500" : "text-orange-500"}`}>
                {mode === "batch" ? "1 (pooled)" : `${stats.connections}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Real-time Updates Demo
function RealtimeDemo() {
  const [mode, setMode] = useState<"polling" | "websocket" | null>(null);
  const [updates, setUpdates] = useState<{id: number; value: number; delay: number}[]>([]);
  const [serverLoad, setServerLoad] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [apiCalls, setApiCalls] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runDemo = async (useWebSocket: boolean) => {
    setMode(useWebSocket ? "websocket" : "polling");
    setIsRunning(true);
    setUpdates([]);
    setServerLoad(0);
    setApiCalls(0);
    setError(null);

    const eventCount = 6;
    
    for (let i = 0; i < eventCount; i++) {
      setApiCalls(prev => prev + 1);
      
      try {
        const response = await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "realtime", useWebSocket, eventId: i }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        setUpdates(prev => [...prev, { 
          id: i, 
          value: data.value ?? Math.floor(Math.random() * 100), 
          delay: data.latency ?? (useWebSocket ? 10 : 350)
        }]);
        setServerLoad(data.serverLoad ?? (useWebSocket ? 5 : Math.min(15 + i * 15, 95)));
      } catch (err) {
        console.error("Realtime API failed:", err);
        setError(err instanceof Error ? err.message : "API call failed");
        // Add fallback update
        setUpdates(prev => [...prev, { 
          id: i, 
          value: Math.floor(Math.random() * 100), 
          delay: useWebSocket ? 10 : 350
        }]);
        setServerLoad(useWebSocket ? 5 : Math.min(15 + i * 15, 95));
      }
      
      // Wait for next event
      await new Promise(r => setTimeout(r, useWebSocket ? 300 : 600));
    }
    
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
          Error: {error}
        </div>
      )}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => runDemo(false)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          HTTP Polling (5s)
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => runDemo(true)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          WebSocket Live
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Live Feed */}
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
              <span className="text-xs text-gray-400">Dashboard Metrics</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">API: {apiCalls}</span>
          </div>
          <div className="space-y-2 max-h-[120px] overflow-y-auto">
            {updates.map((update) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-400">metric_{update.id + 1}</span>
                <span className="text-green-400 font-mono">{update.value}</span>
                <span className={`text-xs ${update.delay < 50 ? "text-green-400" : "text-orange-400"}`}>
                  +{Math.round(update.delay)}ms
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Server Load */}
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-3">Server Load</h4>
          <div className="relative h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${serverLoad}%` }}
              className={`absolute bottom-0 left-0 right-0 ${
                serverLoad > 50 ? "bg-red-500" : "bg-green-500"
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-black dark:text-white">{serverLoad}%</span>
            </div>
          </div>
          <p className="text-xs text-center mt-2 text-black/50 dark:text-white/50">
            {mode === "websocket" ? "Persistent connection" : mode === "polling" ? "Repeated requests" : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveShowcase() {
  const [activeDemo, setActiveDemo] = useState<Demo>("caching");

  const renderDemo = () => {
    switch (activeDemo) {
      case "caching": return <CachingDemo />;
      case "search": return <SearchDemo />;
      case "batch": return <BatchDemo />;
      case "realtime": return <RealtimeDemo />;
    }
  };

  return (
    <section id="demos" className="mt-32 relative scroll-mt-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <motion.span
          className="text-indigo-600 dark:text-indigo-400 font-medium mb-2 block"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          From My Projects
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
          Performance Optimizations
        </h2>
        <p className="mt-4 text-black/60 dark:text-white/60 max-w-2xl">
          Real techniques I&apos;ve implemented at American Airlines and MaxLinear. 
          See the actual performance difference between optimized and naive approaches.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Demo Selector */}
        <div className="space-y-3">
          {(Object.keys(demos) as Demo[]).map((key) => {
            const demo = demos[key];
            const Icon = demo.icon;
            return (
              <motion.button
                key={key}
                whileHover={{ x: 4 }}
                onClick={() => setActiveDemo(key)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  activeDemo === key
                    ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20"
                    : "border-black/10 dark:border-white/10 hover:border-indigo-500/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${demo.color} flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-black dark:text-white text-sm">{demo.name}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{demo.project}</p>
                    <p className="text-xs text-black/50 dark:text-white/50 mt-1 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> {demo.impact}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Demo Area */}
        <motion.div
          layout
          className="lg:col-span-2 card-glow rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${demos[activeDemo].color}`}>
                    {(() => {
                      const Icon = demos[activeDemo].icon;
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white">{demos[activeDemo].name}</h3>
                    <p className="text-xs text-black/50 dark:text-white/50">{demos[activeDemo].description}</p>
                  </div>
                </div>
              </div>
              {renderDemo()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
