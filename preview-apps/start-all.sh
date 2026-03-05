#!/bin/bash

echo "🚀 启动 PM AI Platform 三个版本..."
echo ""

# 检查端口是否被占用
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
    return $?
}

# 停止现有进程
stop_all() {
    echo "🛑 停止所有服务..."
    pkill -f "vite.*5173" 2>/dev/null
    pkill -f "vite.*5174" 2>/dev/null
    pkill -f "vite.*5175" 2>/dev/null
    sleep 2
    echo "✓ 所有服务已停止"
}

# 停止现有服务
stop_all

# 启动服务
cd "$(dirname "$0")"

echo "📡 启动 SDD 主版本 (端口 5173)..."
cd ../pm-ai-app && npm run dev > /tmp/pm-ai-5173.log 2>&1 &
PID1=$!
echo "  PID: $PID1"

sleep 3

echo "📦 启动 SDD 备份版本 (端口 5174)..."
cd sdd2-app && npm run dev > /tmp/pm-ai-5174.log 2>&1 &
PID2=$!
echo "  PID: $PID2"

sleep 3

echo "🎨 启动 Vibe 版本 (端口 5175)..."
cd vibe-app && npm run dev > /tmp/pm-ai-5175.log 2>&1 &
PID3=$!
echo "  PID: $PID3"

sleep 2

echo ""
echo "✅ 所有服务已启动！"
echo ""
echo "📌 访问地址："
echo "   导航页: file://$(pwd)/index.html"
echo "   SDD 主版本: http://localhost:5173"
echo "   SDD 备份版: http://localhost:5174"
echo "   Vibe 版本:  http://localhost:5175"
echo ""
echo "💡 提示：按 Ctrl+C 停止所有服务"
echo ""

# 等待用户中断
trap "stop_all; exit" INT TERM

# 保持脚本运行
wait
