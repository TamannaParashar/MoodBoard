(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/analyseMood/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnalyseMood
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chartjs-2/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ArcElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"]);
function AnalyseMood() {
    _s();
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [moodData, setMoodData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lifeLong, setLifeLong] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lifeLine, setLifeLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalStep, setModalStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0) // 0=Yes/No,1=Enter ID
    ;
    const [modalUserId, setModalUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [lifeLineName, setLifeLineName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [lifeLongCode, setLifeLongCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showConnections, setShowConnections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [connectionsUserId, setConnectionsUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [connections, setConnections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [connectionsLoading, setConnectionsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chatRoom, setChatRoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chatToUser, setChatToUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // ---------- API / UI functions (unchanged behaviour) ----------
    const fetchMyConnections = async ()=>{
        if (!connectionsUserId.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please enter a valid ID");
            return;
        }
        try {
            setConnectionsLoading(true);
            const res = await fetch(`/api/getConnections?userId=${connectionsUserId}`);
            const data = await res.json();
            if (!res.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(data.message || "Failed to fetch connections");
                return;
            }
            setConnections(data.connections || []);
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Something went wrong");
        } finally{
            setConnectionsLoading(false);
        }
    };
    const fetchMoodData = async ()=>{
        setError("");
        setMoodData(null);
        setLoading(true);
        if (!userId.trim()) {
            setError("Please enter a valid ID");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/getMood?userId=${userId}`);
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Unable to fetch mood data");
                setLoading(false);
                return;
            }
            setMoodData(data.moodCounts);
            const moodMessage = {
                happy: `You deserve to be happy😇. Stay joyful!`,
                sad: `It seems you've had a heavy few days. You've shown strength by checking in.`,
                neutral: `Your emotional energy seems low. Let's rebuild it together.`,
                fear: `Fear is temporary. You've faced uncertainty before and can do it again.`,
                surprised: `Life can be unpredictable. You're handling new moments better than you think.`,
                anger: `Anger can be energy. Let's channel it into something constructive or soothing.`
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"])(moodMessage[data.maxMood] || "Keep going, you are doing your best.");
        } catch  {
            setError("Something went wrong");
        } finally{
            setLoading(false);
        }
    };
    const fetchConnectionsMoods = async ()=>{
        if (!userId.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please enter a valid ID");
            return;
        }
        try {
            const res = await fetch(`/api/getConnections?userId=${userId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch connections");
            const connectionsList = data.connections || [];
            if (!connectionsList.length) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info("No connections found for this user.");
                return;
            }
            const moodMessages = {
                happy: "They seem happy 😇",
                sad: "They are feeling sad. You can reach out!",
                neutral: "They feel neutral. Maybe check in?",
                fear: "They are fearful. Offer support!",
                surprised: "They had surprises. Be there for them!",
                anger: "They are angry. Stay calm and supportive."
            };
            await Promise.all(connectionsList.map(async (conn)=>{
                try {
                    const moodRes = await fetch(`/api/connectionMsg?userId=${conn.userId}`);
                    const moodData = await moodRes.json();
                    if (!moodRes.ok || !moodData.mood) return;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(`${conn.name || "Someone"}: ${moodMessages[moodData.mood] || "No mood info"}`);
                } catch (err) {
                    console.error("Error fetching connection mood:", err);
                }
            }));
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err.message || "Something went wrong");
        }
    };
    const handleConnect = (connectionUserId)=>{
        const roomId = [
            userId,
            connectionUserId
        ].sort().join("_");
        router.push(`/chat?roomId=${roomId}&from=${userId}&to=${connectionUserId}`);
    };
    const handleAnalyze = async ()=>{
        await fetchMoodData();
        await fetchConnectionsMoods();
    };
    const handleKeyPress = (e)=>{
        if (e.key === "Enter") handleAnalyze();
    };
    // ---------------- Modal Handlers ----------------
    const handleLifeLongYes = ()=>setModalStep(1);
    const handleLifeLineYes = ()=>setModalStep(1);
    const handleLifeLongSubmit = async ()=>{
        if (!modalUserId.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please enter a valid ID");
            return;
        }
        try {
            const checkRes = await fetch(`/api/checkLifeLongCodeInThisID?userId=${modalUserId}`);
            const checkData = await checkRes.json();
            if (!checkRes.ok) throw new Error(checkData.message || "Check failed");
            let codeToShow = "";
            if (checkData.exists) {
                codeToShow = checkData.code;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"])(`A Lifelong code already exists: ${codeToShow}`);
            } else {
                const generateLifeLongCode = ()=>{
                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    let code = "";
                    for(let i = 0; i < 12; i++){
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return code;
                };
                codeToShow = generateLifeLongCode();
                const storeRes = await fetch(`/api/addLifeLongCode`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: modalUserId,
                        code: codeToShow
                    })
                });
                const storeData = await storeRes.json();
                if (!storeRes.ok) throw new Error(storeData.message || "Failed to store code");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Your Lifelong code: ${codeToShow}`);
            }
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err.message || "Something went wrong");
        } finally{
            setLifeLong(false);
            setModalStep(0);
            setModalUserId("");
        }
    };
    const handleLifeLineSubmit = async ()=>{
        if (!modalUserId.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please enter a valid ID");
            return;
        }
        try {
            const data = await fetch(`/api/checkUser?userId=${modalUserId}`);
            const res = await data.json();
            if (!data.ok || !res.exists) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Invalid user id");
                return;
            }
            const codeCheck = await fetch(`/api/checkLifeLongCodeInWhole?lifeLongCode=${lifeLongCode}`);
            const codeData = await codeCheck.json();
            if (!codeData.exists) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Invalid Lifelong Code");
                return;
            }
            const lifeLineRes = await fetch("/api/addLifeLineCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: codeData.ownerUserId,
                    connection: {
                        userId: modalUserId,
                        name: lifeLineName || ""
                    }
                })
            });
            if (lifeLineRes.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`You are now connected to ${lifeLineName}`);
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Something went wrong");
        } finally{
            setLifeLine(false);
            setModalStep(0);
            setModalUserId("");
            setLifeLineName("");
        }
    };
    // ---------------- Modal renderers (unchanged, but rely on above handlers) ----------------
    const renderModal = ()=>{
        if (!lifeLong && !lifeLine) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white",
                children: [
                    modalStep === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: lifeLong ? "Stay supported without giving away your identity. Create a Lifelong Code and share it with a trusted person—if your mood is consistently low, they will receive a safe, anonymous alert to help you. Do you want to proceed?" : "Stay connected with a trusted person through Lifeline. When their mood signals distress, you'll get a notification so you can offer support—no personal info is shared. Do you want to proceed?"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 257,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "px-4 py-2 bg-indigo-600 rounded-lg",
                                        onClick: lifeLong ? handleLifeLongYes : handleLifeLineYes,
                                        children: "Yes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 263,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "px-4 py-2 bg-red-600 rounded-lg",
                                        onClick: ()=>{
                                            setLifeLong(false);
                                            setLifeLine(false);
                                        },
                                        children: "No"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 262,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/analyseMood/page.jsx",
                        lineNumber: 256,
                        columnNumber: 13
                    }, this),
                    modalStep === 1 && lifeLong && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Enter your user ID to generate a Lifelong code:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 284,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: modalUserId,
                                onChange: (e)=>setModalUserId(e.target.value),
                                className: "w-full p-3 rounded-lg bg-slate-700/50 text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 285,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLifeLongSubmit,
                                        className: "px-4 py-2 bg-indigo-600 rounded-lg",
                                        children: "Generate Code"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 292,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setLifeLong(false);
                                            setModalStep(0);
                                            setModalUserId("");
                                        },
                                        className: "px-4 py-2 bg-red-600 rounded-lg",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 298,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 291,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/analyseMood/page.jsx",
                        lineNumber: 283,
                        columnNumber: 13
                    }, this),
                    modalStep === 1 && lifeLine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Enter your user ID:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 313,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: modalUserId,
                                onChange: (e)=>setModalUserId(e.target.value),
                                className: "w-full p-3 rounded-lg bg-slate-700/50 text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 314,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Enter THEIR Lifelong Code:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Their 12-digit code",
                                value: lifeLongCode,
                                onChange: (e)=>setLifeLongCode(e.target.value),
                                className: "w-full p-3 rounded-lg bg-slate-700/50 text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 321,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Give a name for this connection",
                                value: lifeLineName,
                                onChange: (e)=>setLifeLineName(e.target.value),
                                className: "w-full p-3 rounded-lg bg-slate-700/50 text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 328,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLifeLineSubmit,
                                        className: "px-4 py-2 bg-indigo-600 rounded-lg",
                                        children: "Connect"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 336,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setLifeLine(false);
                                            setModalStep(0);
                                            setModalUserId("");
                                            setLifeLineName("");
                                            setLifeLongCode("");
                                        },
                                        className: "px-4 py-2 bg-red-600 rounded-lg",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 342,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 335,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/analyseMood/page.jsx",
                        lineNumber: 312,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/analyseMood/page.jsx",
                lineNumber: 254,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/analyseMood/page.jsx",
            lineNumber: 253,
            columnNumber: 7
        }, this);
    };
    const renderConnectionsModal = ()=>{
        if (!showConnections) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white space-y-6",
                children: [
                    connections.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg font-semibold",
                                children: "Enter your User ID"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 370,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: connectionsUserId,
                                onChange: (e)=>setConnectionsUserId(e.target.value),
                                className: "w-full p-3 rounded-lg bg-slate-700/50 text-white",
                                placeholder: "Your ID"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 372,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: fetchMyConnections,
                                        className: "px-4 py-2 bg-indigo-600 rounded-lg",
                                        disabled: connectionsLoading,
                                        children: connectionsLoading ? "Loading..." : "OK"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 381,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowConnections(false);
                                            setConnections([]);
                                            setConnectionsUserId("");
                                        },
                                        className: "px-4 py-2 bg-red-600 rounded-lg",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 389,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 380,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    connections.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-bold mb-4",
                                children: "My Connections"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 405,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: connections.map((conn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between bg-slate-800/60 p-3 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: conn.name || "Unnamed"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                                lineNumber: 413,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold",
                                                onClick: ()=>handleConnect(conn.userId),
                                                children: "Connect"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                                lineNumber: 415,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, conn.userId, true, {
                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                        lineNumber: 409,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 407,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end mt-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowConnections(false);
                                        setConnections([]);
                                        setConnectionsUserId("");
                                    },
                                    className: "px-4 py-2 bg-red-600 rounded-lg",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                    lineNumber: 426,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 425,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/analyseMood/page.jsx",
                lineNumber: 367,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/analyseMood/page.jsx",
            lineNumber: 366,
            columnNumber: 7
        }, this);
    };
    // ---------------- Mood Data Colors & Total ----------------
    const moodColors = [
        "#6366F1",
        "#EC4899",
        "#3B82F6",
        "#F59E0B",
        "#10B981",
        "#F43F5E",
        "#A855F7"
    ];
    const totalMoods = moodData ? Object.values(moodData).reduce((a, b)=>a + b, 0) : 0;
    // ---------------- Render ----------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl m-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setLifeLong(true),
                            children: "LifeLong code"
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 453,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/analyseMood/page.jsx",
                        lineNumber: 452,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl m-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setLifeLine(true),
                            children: "Get LifeLine"
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 456,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/analyseMood/page.jsx",
                        lineNumber: 455,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl m-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowConnections(true),
                            children: "My Connections"
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 459,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/analyseMood/page.jsx",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/analyseMood/page.jsx",
                lineNumber: 451,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                            position: "top-right",
                            richColors: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 465,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-semibold text-slate-300 mb-4",
                                    children: "Enter Your ID"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                    lineNumber: 469,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Enter your unique ID",
                                            value: userId,
                                            onChange: (e)=>setUserId(e.target.value),
                                            onKeyPress: handleKeyPress,
                                            className: "flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 471,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleAnalyze,
                                            disabled: loading,
                                            className: "px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl",
                                            children: loading ? "Analyzing..." : "Analyze"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 479,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                    lineNumber: 470,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 468,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 text-red-200 text-center",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 491,
                            columnNumber: 13
                        }, this),
                        moodData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold text-white mb-8 text-center",
                                            children: "Your Mood Distribution"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-80 h-80",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Doughnut"], {
                                                    data: {
                                                        labels: Object.keys(moodData),
                                                        datasets: [
                                                            {
                                                                data: Object.values(moodData),
                                                                backgroundColor: moodColors,
                                                                borderColor: "#1e293b",
                                                                borderWidth: 3,
                                                                hoverBorderColor: "#ffffff",
                                                                hoverBorderWidth: 4
                                                            }
                                                        ]
                                                    },
                                                    options: {
                                                        responsive: true,
                                                        maintainAspectRatio: true,
                                                        plugins: {
                                                            legend: {
                                                                position: "bottom",
                                                                labels: {
                                                                    color: "#cbd5e1",
                                                                    font: {
                                                                        size: 13,
                                                                        weight: "600"
                                                                    },
                                                                    padding: 20,
                                                                    usePointStyle: true,
                                                                    pointStyle: "circle"
                                                                }
                                                            },
                                                            tooltip: {
                                                                backgroundColor: "rgba(15, 23, 42, 0.9)",
                                                                titleColor: "#e2e8f0",
                                                                bodyColor: "#cbd5e1",
                                                                borderColor: "#475569",
                                                                borderWidth: 1,
                                                                padding: 12,
                                                                displayColors: true,
                                                                callbacks: {
                                                                    label: (context)=>{
                                                                        const total = context.dataset.data.reduce((a, b)=>a + b, 0);
                                                                        const percentage = (context.parsed / total * 100).toFixed(1);
                                                                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                    lineNumber: 504,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                                lineNumber: 503,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 502,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 shadow-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-slate-400 text-sm font-medium mb-2",
                                                    children: "Total Entries"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                    lineNumber: 558,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold text-indigo-400",
                                                    children: totalMoods
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                    lineNumber: 559,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 557,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 shadow-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-slate-400 text-sm font-medium mb-2",
                                                    children: "Mood Types"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                    lineNumber: 562,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold text-purple-400",
                                                    children: Object.keys(moodData).length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                    lineNumber: 563,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 561,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                    lineNumber: 556,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold text-white mb-6",
                                            children: "Detailed Breakdown"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 569,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: Object.entries(moodData).map(([mood, count], index)=>{
                                                const percentage = (count / totalMoods * 100).toFixed(1);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-4 h-4 rounded-full",
                                                            style: {
                                                                backgroundColor: moodColors[index % moodColors.length]
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                                            lineNumber: 575,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-center mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-slate-300 font-medium capitalize",
                                                                            children: mood
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                                                            lineNumber: 581,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-slate-400 text-sm",
                                                                            children: [
                                                                                count,
                                                                                " • ",
                                                                                percentage,
                                                                                "%"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                                                            lineNumber: 582,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                                    lineNumber: 580,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-full bg-slate-700/50 rounded-full h-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-2 rounded-full transition-all duration-500",
                                                                        style: {
                                                                            width: `${percentage}%`,
                                                                            backgroundColor: moodColors[index % moodColors.length]
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/analyseMood/page.jsx",
                                                                        lineNumber: 587,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                                    lineNumber: 586,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                                            lineNumber: 579,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, mood, true, {
                                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                                    lineNumber: 574,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyseMood/page.jsx",
                                            lineNumber: 570,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/analyseMood/page.jsx",
                                    lineNumber: 568,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 498,
                            columnNumber: 13
                        }, this),
                        !moodData && !loading && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400 text-lg",
                                children: "Enter your ID and click Analyze to see your mood distribution"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyseMood/page.jsx",
                                lineNumber: 607,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 606,
                            columnNumber: 13
                        }, this),
                        chatRoom && chatToUser && userId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatInterface, {
                            roomId: chatRoom,
                            fromUserId: userId,
                            toUserId: chatToUser,
                            onClose: ()=>{
                                setChatRoom(null);
                                setChatToUser(null);
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyseMood/page.jsx",
                            lineNumber: 611,
                            columnNumber: 3
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/analyseMood/page.jsx",
                    lineNumber: 464,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/analyseMood/page.jsx",
                lineNumber: 463,
                columnNumber: 7
            }, this),
            renderModal(),
            renderConnectionsModal()
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/analyseMood/page.jsx",
        lineNumber: 450,
        columnNumber: 5
    }, this);
}
_s(AnalyseMood, "1O3riuW5hbaF7N0qA6bOIw5kWIU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AnalyseMood;
var _c;
__turbopack_context__.k.register(_c, "AnalyseMood");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_analyseMood_page_jsx_215e678d._.js.map