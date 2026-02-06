// app/api/demo/route.ts
import { NextRequest, NextResponse } from "next/server";

// Simulated database for caching demo
const flightCache = new Map<string, { data: unknown; cachedAt: number }>();
const CACHE_TTL = 60000; // 1 minute

// Simulated log index for search demo
const logIndex = new Map<string, number[]>();
const logs: string[] = [];

// Initialize demo data
function initializeDemoData() {
  if (logs.length === 0) {
    const logTypes = [
      "INFO: Request processed successfully",
      "DEBUG: Connection established",
      "WARN: High memory usage detected",
      "ERROR: Connection timeout at service.auth.validate()",
      "INFO: Cache hit for user session",
      "DEBUG: Query executed in 45ms",
      "ERROR: Database connection failed",
      "INFO: Scheduled job completed",
    ];
    
    // Generate 10000 log entries
    for (let i = 0; i < 10000; i++) {
      const log = logTypes[Math.floor(Math.random() * logTypes.length)];
      logs.push(`[${i}] ${log}`);
      
      // Build index
      const words = log.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (!logIndex.has(word)) {
          logIndex.set(word, []);
        }
        logIndex.get(word)!.push(i);
      });
    }
  }
}

initializeDemoData();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;
    
    switch (type) {
      case "caching":
        return handleCachingDemo(body);
      case "search":
        return handleSearchDemo(body);
      case "batch":
        return handleBatchDemo(body);
      case "realtime":
        return handleRealtimeDemo(body);
      default:
        return NextResponse.json({ error: "Unknown demo type", receivedType: type }, { status: 400 });
    }
  } catch (error) {
    console.error("Demo API error:", error);
    return NextResponse.json({ error: "Demo failed", details: String(error) }, { status: 500 });
  }
}

async function handleCachingDemo(params: { flightId: string; useCache: boolean }) {
  const { flightId, useCache } = params;
  const startTime = Date.now();
  
  if (useCache) {
    // Check cache
    const cached = flightCache.get(flightId);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true,
        responseTime: Date.now() - startTime + Math.random() * 15,
        source: "redis_cache",
      });
    }
  }
  
  // Simulate database query
  await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
  
  const flightData = {
    flightId,
    departure: "DFW",
    arrival: "LAX",
    status: "On Time",
    gate: `A${Math.floor(Math.random() * 30) + 1}`,
  };
  
  if (useCache) {
    flightCache.set(flightId, { data: flightData, cachedAt: Date.now() });
  }
  
  return NextResponse.json({
    success: true,
    data: flightData,
    cached: false,
    responseTime: Date.now() - startTime,
    source: "postgresql_db",
  });
}

async function handleSearchDemo(params: { query: string; useIndexed: boolean }) {
  const { query, useIndexed } = params;
  const startTime = Date.now();
  let comparisons = 0;
  let foundAt = -1;
  
  if (useIndexed) {
    // Indexed search - O(log n)
    const searchWords = query.toLowerCase().split(/\s+/);
    // Look for "error" as the key search term
    const searchWord = searchWords.find(w => w === "error" || w === "connection" || w === "timeout") || searchWords[0];
    const indices = logIndex.get(searchWord) || [];
    comparisons = Math.ceil(Math.log2(logs.length)) + Math.min(indices.length, 20);
    
    // Simulate indexed lookup time
    await new Promise(r => setTimeout(r, 10 + Math.random() * 20));
    
    if (indices.length > 0) {
      foundAt = indices[0];
    }
  } else {
    // Linear search - O(n)
    const searchLower = query.toLowerCase();
    for (let i = 0; i < logs.length; i++) {
      comparisons++;
      if (logs[i].toLowerCase().includes(searchLower)) {
        foundAt = i;
        break;
      }
      // Simulate processing time every 1000 entries
      if (i % 1000 === 0) {
        await new Promise(r => setTimeout(r, 30));
      }
    }
  }
  
  return NextResponse.json({
    success: true,
    found: foundAt !== -1,
    foundAt,
    comparisons,
    totalLogs: logs.length,
    responseTime: Date.now() - startTime,
    algorithm: useIndexed ? "btree_index" : "sequential_scan",
    complexity: useIndexed ? "O(log n)" : "O(n)",
  });
}

async function handleBatchDemo(params: { count: number; useBatch: boolean }) {
  const { count = 12, useBatch } = params;
  const startTime = Date.now();
  const results: { id: number; processedAt: number }[] = [];
  
  if (useBatch) {
    // Batch processing - process in groups of 4
    const batchSize = 4;
    for (let batch = 0; batch < Math.ceil(count / batchSize); batch++) {
      await new Promise(r => setTimeout(r, 50 + Math.random() * 30));
      
      for (let i = batch * batchSize; i < Math.min((batch + 1) * batchSize, count); i++) {
        results.push({ id: i, processedAt: Date.now() - startTime });
      }
    }
  } else {
    // Individual requests - sequential with connection overhead
    for (let i = 0; i < count; i++) {
      await new Promise(r => setTimeout(r, 80 + Math.random() * 40)); // Connection overhead
      results.push({ id: i, processedAt: Date.now() - startTime });
    }
  }
  
  return NextResponse.json({
    success: true,
    results,
    responseTime: Date.now() - startTime,
    totalTime: Date.now() - startTime,
    itemCount: count,
    method: useBatch ? "batch_with_pooling" : "individual_connections",
    connections: useBatch ? 1 : count,
    connectionsUsed: useBatch ? 1 : count,
    efficiency: useBatch ? "optimized" : "naive",
  });
}

async function handleRealtimeDemo(params: { eventId: number; useWebSocket: boolean }) {
  const { eventId = 0, useWebSocket } = params;
  
  if (useWebSocket) {
    // WebSocket - persistent connection, low latency
    await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
    const latency = 5 + Math.random() * 15;
    return NextResponse.json({
      success: true,
      eventId,
      value: Math.floor(Math.random() * 100),
      latency,
      serverLoad: 5,
      method: "websocket_push",
      protocol: "ws://",
    });
  } else {
    // Polling - new connection each time, high latency
    await new Promise(r => setTimeout(r, 100 + Math.random() * 100));
    const latency = 200 + Math.random() * 300;
    const serverLoad = Math.min(15 + eventId * 15, 95);
    return NextResponse.json({
      success: true,
      eventId,
      value: Math.floor(Math.random() * 100),
      latency,
      serverLoad,
      method: "http_polling",
      protocol: "http://",
    });
  }
}
