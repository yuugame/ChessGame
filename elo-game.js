import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, setPersistence, browserLocalPersistence, signInAnonymously, signInWithCustomToken, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, OAuthProvider, EmailAuthProvider, linkWithCredential, updateProfile, signInWithPopup, signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, fetchSignInMethodsForEmail, reauthenticateWithPopup, reauthenticateWithCredential, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc, runTransaction, deleteField } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // --- 多言語辞書と管理機能 ---
        const TRANSLATIONS = {
            ja: {
                title: "CHESS", vsCpu: "フリー対戦 (VS CPU)", rankedMatch: "ランクマッチ (VS CPU)", currentRate: "あなたの推定ELO", cpuEloLabel: "推定ELO",
                offlinePvp: "2人プレイ(オフライン)", onlinePvp: "オンライン対戦",
                authStatusPreparing: "アカウント同期中...", authStatusReady: "オンライン接続準備完了", cpuSettings: "CPU設定", loginRequiredInfo: "ログインするとランクマッチとオンライン対戦が利用できます。",
                difficulty: "初期難易度レベル", beginner: "初級", advanced: "マスター (Lv.50)", cpuNote: "※ 先手(白)・後手(黒)はランダムに決定されます。後手の場合は盤面が反転し黒が下になります。<br>※ 対局中、プレイヤーの動きに合わせてレベルが自動調整されます。",
                nextToTime: "時間設定へ進む", back: "戻る", onlineSettings: "オンライン対戦", playerNamePlaceholder: "あなたの名前 (任意)",
                roomWordPlaceholder: "合言葉を入力", joinRoom: "部屋に入る", or: "または", createRoom: "部屋を作る",
                waitingOpponent: "対戦相手を待っています...",
                roomWordInfo: "合言葉:", cancel: "キャンセル", timeSettings: "設定", turnConfig: "先攻/後攻", random: "ランダム",
                fixedHostWhite: "ホスト(親機)が先攻・白", timeLimitText: "時間制限", time10m5s: "10分 + 5秒", time5m3s: "5分 + 3秒", time1m10s: "1分 + 10秒",
                noLimit: "制限なしで開始", promotion: "プロモーション", confirmTitle: "確認", confirmMessage: "本当に実行しますか？", yes: "はい", no: "いいえ",
                modeText: "MODE", cpuName: "CPU", you: "あなた", opponent: "相手", p1White: "白(先手)", p2Black: "黒(後手)", statusReady: "準備完了",
                undoMove: "1手戻る", rematch: "もう一回やる", exit: "終了", assistMode: "アシストモード (最善手候補を表示)", anonymous: "匿名プレイヤー",
                whiteTurn: "白の番です", blackTurn: "黒の番です", yourTurn: "あなたの番です", opponentTurn: "相手の番です", checkmate: "チェックメイト！",
                timeout: "時間切れ！", winSuffix: "の勝ち", youWin: "あなたの勝ち！ 🎉", youLose: "あなたの負け...", checkWarning: "⚠️ チェック！ ",
                waitingOpponentAck: "受信待機中...", waitingCommunication: "通信待機中...", rematchPrep: "再戦の準備中...", rematchFailed: "再戦の準備に失敗しました",
                error: "エラー", commError: "通信エラー", cannotJoinTitle: "部屋に入れません", cannotJoinMsg: "この合言葉の部屋は既に対戦中か、過去の対戦データが残っています。\n\n再戦する場合は、どちらかが「部屋を作る」を押して部屋を新しく上書きしてください。",
                disconnectTitle: "切断", disconnectMsg: "対戦相手が退出したか部屋が削除されました。", abandonTitle: "終了", abandonMsg: " が退出しました。",
                opponentDisconnectedMsg: "対戦相手の通信が切断されました", inputRoomWordMsg: "合言葉を入力してください", firebaseErrorMsg: "Firebaseの設定が見つかりません。",
                connectingMsg: "サーバーに接続しています。数秒後にお試しください。", roomNotFoundMsg: "指定された合言葉の部屋が見つかりません。", createRoomFailedMsg: "部屋の作成に失敗しました。\n",
                noUndoOnlineMsg: "オンライン対戦、またはランクマッチ中は「待った」を使用できません。", confirmUndoMsg: "1手前の状態に戻しますか？", confirmExitMsg: "現在のゲームを終了してタイトルに戻りますか？\n（オンラインの場合は部屋が削除されます）",
                rankedExitTitle: "ランクマッチ終了", rankedExitMsg: "ランクマッチを途中で終了しますか？\n（この試合の推定ELO変動は保存されません）",
                resumeGameTitle: "続きから開始", resumeGameMsg: "続きから始めますか？\n（前回の盤面・時間・設定を復元します）",
                colorWhiteSuffix: " (白・先手)", colorBlackSuffix: " (黒・後手)", colorWhitePvp: " (白・先手)", colorBlackPvp: " (黒・後手)",
                stalemate: "ステイルメイト", drawMsg: "引き分け", insufficientMaterial: "戦力不足",
                threefoldRepetition: "千日手", fiftyMoveRule: "50手ルール", reconnecting: "再接続しています...", moveCountPrefix: "手数: ",
                baseTime: "持ち時間", incTime: "追加時間 (1手)", startGame: "ゲーム開始", min: "分", sec: "秒", incNone: "なし", disconnectErrorMsg: "通信エラーが発生したため、タイトル画面に戻ります。",
                autoRotate: "黒(後攻)の番の時に文字と駒を逆さまにする", whiteShort: "白", blackShort: "黒", turnWord: "ターン",
                identityModalTitle: "名前 / ID の変更", identityNameLabel: "名前", identityIdLabel: "ID",
                identityNamePlaceholder: "名前を入力", identityIdPlaceholder: "英数字ID", identityRandom: "ランダム",
                identityHint: "名前は重複可。IDは英数字のみで、他のユーザーと重複しません。", identitySave: "保存",
                usernameLabel: "ユーザーネーム", changeIdentityBtn: "名前/IDの変更", profileIdLabel: "ID", logoutBtn: "ログアウト",
                authChooseProvider: "ログイン方法を選択", authOpenModal: "サインアップ / ログイン", authModalTitle: "サインアップ / ログイン",
                authSignupTitle: "Eメールアドレス　サインアップ", authSignupBtn: "サインアップ", authEmailLabel: "Eメールアドレス", authPasswordLabel: "パスワード",
                authPasswordLogin: "ログイン", authOrDivider: "または",
                authGoogleLogin: "Googleでログイン", authFacebookLogin: "Facebookでログイン", authAppleLogin: "Appleでログイン", authGitHubLogin: "GitHubでログイン",
                authProviderEmail: "Eメール", authProviderGoogle: "Google", authProviderApple: "Apple", authProviderFacebook: "Facebook", authProviderGitHub: "GitHub",
                authRegistrationTitle: "登録情報の入力", authRegistrationHint: "メールリンク認証が完了しました。アカウント情報を設定してください。", authRegistrationPending: "登録情報を入力してください。",
                authUsernameLabel: "ユーザーネーム", authPasswordConfirmLabel: "パスワード（確認）", authRegisterBtn: "登録",
                authEmailLinkSent: "確認リンクをメール送信しました。メールを開いてログインを完了してください。",
                settingsBtn: "設定", settingsTitle: "設定", deleteAccountBtn: "アカウントの削除", deleteAccountHint: "削除するには、自分のユーザーIDまたはプロフィールIDを入力してください。", deleteAccountInputPlaceholder: "ユーザーIDを入力",
                deleteAccountVerify: "確認", deleteAccountConfirmTitle: "アカウント削除", deleteAccountConfirmMsg: "本当に削除しますか？", deleteAccountIdMismatch: "ユーザーIDが一致しません",
                deleteAccountReauthTitle: "再認証が必要です", deleteAccountReauthMsg: "アカウント削除の前に、もう一度ログインしてください。"
            },
            en: {
                title: "CHESS", vsCpu: "Free Match (VS CPU)", rankedMatch: "Ranked Match (VS CPU)", currentRate: "Your Estimated ELO", cpuEloLabel: "Estimated ELO",
                offlinePvp: "2 Player (Offline)", onlinePvp: "Online Match",
                authStatusPreparing: "Syncing Account...", authStatusReady: "Ready for online play", cpuSettings: "CPU Settings", loginRequiredInfo: "Log in to unlock ranked matches and online play.",
                difficulty: "Initial Difficulty", beginner: "Beginner", advanced: "Grandmaster (ELO 2500)", cpuNote: "* Colors (White/Black) are random. Board inverts if Black.\n* CPU level auto-adjusts based on your performance.",
                nextToTime: "Next", back: "Back", onlineSettings: "Online Match", playerNamePlaceholder: "Your Name (Optional)",
                roomWordPlaceholder: "Room Word", joinRoom: "Join", or: "OR", createRoom: "Create",
                waitingOpponent: "Waiting for opponent...",
                roomWordInfo: "Word:", cancel: "Cancel", timeSettings: "Settings", turnConfig: "First/Second", random: "Random",
                fixedHostWhite: "Host plays First(White)", timeLimitText: "Time Control", time10m5s: "10m + 5s", time5m3s: "5m + 3s", time1m10s: "1m + 10s",
                noLimit: "No Limit", promotion: "Promotion", confirmTitle: "Confirm", confirmMessage: "Are you sure?", yes: "Yes", no: "No",
                modeText: "MODE", cpuName: "CPU", you: "You", opponent: "Opponent", p1White: "White (First)", p2Black: "Black (Second)", statusReady: "Ready",
                undoMove: "Undo", rematch: "Rematch", exit: "Exit", assistMode: "Assist Mode (Show hints)", anonymous: "Anonymous",
                whiteTurn: "White's turn", blackTurn: "Black's turn", yourTurn: "Your turn", opponentTurn: "Opponent's turn", checkmate: "Checkmate!",
                timeout: "Time Out!", winSuffix: " wins", youWin: "You Win! 🎉", youLose: "You Lose...", checkWarning: "⚠️ Check! ",
                waitingOpponentAck: "Waiting...", waitingCommunication: "Waiting for communication...", rematchPrep: "Preparing rematch...", rematchFailed: "Failed to prepare rematch",
                error: "Error", commError: "Connection Error", cannotJoinTitle: "Cannot Join", cannotJoinMsg: "Room is in play or has old data.\n\nTo rematch, please 'Create' to overwrite.",
                disconnectTitle: "Disconnected", disconnectMsg: "Opponent left or room was deleted.", abandonTitle: "Ended", abandonMsg: " left the room.",
                opponentDisconnectedMsg: "Opponent disconnected", inputRoomWordMsg: "Please enter a room word.", firebaseErrorMsg: "Firebase config not found.",
                connectingMsg: "Connecting. Try again in a few seconds.", roomNotFoundMsg: "Room not found.", createRoomFailedMsg: "Failed to create room.\n",
                noUndoOnlineMsg: "Cannot undo in online or ranked matches.", confirmUndoMsg: "Undo the last move?", confirmExitMsg: "Exit and return to title?\n(Online room will be deleted)",
                rankedExitTitle: "Exit Ranked Match", rankedExitMsg: "Exit the ranked match now?\n(This match's ELO change will not be saved.)",
                resumeGameTitle: "Resume Game", resumeGameMsg: "Continue from where you left off?\n(The previous board, time, and settings will be restored.)",
                colorWhiteSuffix: " (White)", colorBlackSuffix: " (Black)", colorWhitePvp: " (White)", colorBlackPvp: " (Black)",
                stalemate: "Stalemate", drawMsg: "Draw", insufficientMaterial: "Insufficient Material",
                threefoldRepetition: "Threefold Repetition", fiftyMoveRule: "50-Move Rule", reconnecting: "ReConnecting...", moveCountPrefix: "Moves: ",
                baseTime: "Base Time", incTime: "Increment", startGame: "Start Game", min: "m", sec: "s", incNone: "None", disconnectErrorMsg: "Connection error occurred. Returning to title.",
                autoRotate: "Rotate pieces and text for Black", whiteShort: "White", blackShort: "Black", turnWord: "Turn ",
                identityModalTitle: "Change Name / ID", identityNameLabel: "Name", identityIdLabel: "ID",
                identityNamePlaceholder: "Enter name", identityIdPlaceholder: "Alphanumeric ID", identityRandom: "Random",
                identityHint: "Names can duplicate. IDs use only letters and digits, and must be unique.", identitySave: "Save",
                usernameLabel: "Username", changeIdentityBtn: "Change Name / ID", profileIdLabel: "ID", logoutBtn: "Log out",
                authChooseProvider: "Choose sign-in method", authOpenModal: "Sign up / Sign in", authModalTitle: "Sign up / Sign in",
                authSignupTitle: "Email Signup", authSignupBtn: "Sign up", authEmailLabel: "Email", authPasswordLabel: "Password",
                authPasswordLogin: "Sign in", authOrDivider: "OR",
                authGoogleLogin: "Sign in with Google", authFacebookLogin: "Sign in with Facebook", authAppleLogin: "Sign in with Apple", authGitHubLogin: "Sign in with GitHub",
                authProviderEmail: "Email", authProviderGoogle: "Google", authProviderApple: "Apple", authProviderFacebook: "Facebook", authProviderGitHub: "GitHub",
                authRegistrationTitle: "Complete Registration", authRegistrationHint: "Email link sign-in is complete. Set up your account details.", authRegistrationPending: "Please finish registration.",
                authUsernameLabel: "Username", authPasswordConfirmLabel: "Confirm Password", authRegisterBtn: "Register",
                authEmailLinkSent: "A verification link was sent. Open your email to finish sign-in.",
                settingsBtn: "Settings", settingsTitle: "Settings", deleteAccountBtn: "Delete Account", deleteAccountHint: "To delete the account, enter your user ID or profile ID.", deleteAccountInputPlaceholder: "Enter user ID",
                deleteAccountVerify: "Verify", deleteAccountConfirmTitle: "Delete Account", deleteAccountConfirmMsg: "Do you really want to delete your account?", deleteAccountIdMismatch: "User ID does not match",
                deleteAccountReauthTitle: "Re-authentication Required", deleteAccountReauthMsg: "Please sign in again before deleting your account."
            },
            zh: {
                title: "国际象棋", vsCpu: "自由对战 (人机)", rankedMatch: "排位赛 (人机)", currentRate: "您的估计评分 (ELO)", cpuEloLabel: "估计ELO",
                offlinePvp: "双人对战 (离线)", onlinePvp: "在线对战",
                authStatusPreparing: "账号同步中...", authStatusReady: "在线对战准备就绪", cpuSettings: "人机设置", loginRequiredInfo: "登录后可开启排位赛和在线对战。",
                difficulty: "初始难度等级", beginner: "初级", advanced: "大师 (Lv.50)", cpuNote: "※ 执白或执黑随机决定。如果执黑，棋盘将会翻转。\n※ 对战中，人机等级会根据您的表现自动调整。",
                nextToTime: "下一步", back: "返回", onlineSettings: "在线对战", playerNamePlaceholder: "你的名字 (可选)",
                roomWordPlaceholder: "输入房间口令", joinRoom: "加入房间", or: "或", createRoom: "创建房间",
                waitingOpponent: "等待加入...",
                roomWordInfo: "房间口令:", cancel: "取消", timeSettings: "设置", turnConfig: "先后手", random: "随机",
                fixedHostWhite: "房主先手(白方)", timeLimitText: "时间限制", time10m5s: "10分 + 5秒", time5m3s: "5分 + 3秒", time1m10s: "1分 + 10秒",
                noLimit: "无限制", promotion: "升变", confirmTitle: "确认", confirmMessage: "确定要执行此操作吗？", yes: "是", no: "否",
                modeText: "模式", cpuName: "CPU", you: "你", opponent: "对手", p1White: "白方 (先手)", p2Black: "黑方 (后手)", statusReady: "准备就绪",
                undoMove: "悔棋", rematch: "再来一局", exit: "退出", assistMode: "辅助模式 (显示提示)", anonymous: "匿名玩家",
                whiteTurn: "白方回合", blackTurn: "黑方回合", yourTurn: "你的回合", opponentTurn: "对手回合", checkmate: "将死！",
                timeout: "超时！", winSuffix: " 获胜", youWin: "你赢了！ 🎉", youLose: "你输了...", checkWarning: "⚠️ 将军！ ",
                waitingOpponentAck: "等待响应...", waitingCommunication: "等待通信中...", rematchPrep: "正在准备重賽...", rematchFailed: "准备重赛失败",
                error: "错误", commError: "通信错误", cannotJoinTitle: "无法加入", cannotJoinMsg: "该房间正在对战中或存有旧数据。\n\n如需重赛，请点击“创建房间”以覆盖原房间。",
                disconnectTitle: "连接断开", disconnectMsg: "对手已离开或房间被删除。", abandonTitle: "游戏结束", abandonMsg: " 离开了房间。",
                opponentDisconnectedMsg: "对手的连接已断開", inputRoomWordMsg: "请输入房间口令", firebaseErrorMsg: "未找到Firebase配置。",
                connectingMsg: "正在连接，请稍后再试。", roomNotFoundMsg: "未找到该口令的房间。", createRoomFailedMsg: "创建房间失败。\n",
                noUndoOnlineMsg: "在线对戦或排位赛中无法悔棋。", confirmUndoMsg: "是否撤销上一步棋？", confirmExitMsg: "是否退出当前游戏并返回标题？\n（在线房间将被删除）",
                rankedExitTitle: "退出排位赛", rankedExitMsg: "要现在结束排位赛吗？\n（本局的 ELO 变化不会保存）",
                resumeGameTitle: "继续游戏", resumeGameMsg: "要继续上次的进度吗？\n（将恢复上一次的棋盘、时间和设置）",
                colorWhiteSuffix: " (白方)", colorBlackSuffix: " (黑方)", colorWhitePvp: " (白方)", colorBlackPvp: " (黑方)",
                stalemate: "逼和", drawMsg: "平局", insufficientMaterial: "兵力不足",
                threefoldRepetition: "三次重复局面", fiftyMoveRule: "五十回合规则", reconnecting: "正在重新连接...", moveCountPrefix: "步数: ",
                baseTime: "初始时间", incTime: "每步加时", startGame: "开始游戏", min: "分", sec: "秒", incNone: "无", disconnectErrorMsg: "发生通信错误，将返回标题画面。",
                autoRotate: "黑方回合时翻转棋子和文字", whiteShort: "白方", blackShort: "黑方", turnWord: "回合",
                identityModalTitle: "修改昵称 / ID", identityNameLabel: "昵称", identityIdLabel: "ID",
                identityNamePlaceholder: "输入昵称", identityIdPlaceholder: "字母数字ID", identityRandom: "随机",
                identityHint: "昵称可重复。ID 只能使用字母和数字，且不能重复。", identitySave: "保存",
                usernameLabel: "用户名", changeIdentityBtn: "修改昵称 / ID", profileIdLabel: "ID", logoutBtn: "退出登录",
                authChooseProvider: "选择登录方式", authOpenModal: "注册 / 登录", authModalTitle: "注册 / 登录",
                authSignupTitle: "邮箱注册", authSignupBtn: "注册", authEmailLabel: "邮箱", authPasswordLabel: "密码",
                authPasswordLogin: "登录", authOrDivider: "或者",
                authGoogleLogin: "使用 Google 登录", authFacebookLogin: "使用 Facebook 登录", authAppleLogin: "使用 Apple 登录", authGitHubLogin: "使用 GitHub 登录",
                authProviderEmail: "邮箱", authProviderGoogle: "Google", authProviderApple: "Apple", authProviderFacebook: "Facebook", authProviderGitHub: "GitHub",
                authRegistrationTitle: "完成注册", authRegistrationHint: "邮件链接登录已完成，请设置你的账号信息。", authRegistrationPending: "请完成注册信息。",
                authUsernameLabel: "用户名", authPasswordConfirmLabel: "确认密码", authRegisterBtn: "注册",
                authEmailLinkSent: "验证链接已发送到邮箱。请打开邮件完成登录。",
                settingsBtn: "设置", settingsTitle: "设置", deleteAccountBtn: "删除账号", deleteAccountHint: "删除账号前，请输入自己的用户ID或个人资料ID。", deleteAccountInputPlaceholder: "输入用户ID",
                deleteAccountVerify: "确认", deleteAccountConfirmTitle: "删除账号", deleteAccountConfirmMsg: "真的要删除吗？", deleteAccountIdMismatch: "用户ID不一致",
                deleteAccountReauthTitle: "需要重新验证", deleteAccountReauthMsg: "删除账号前，请重新登录。"
            }
        };

        const LANGUAGE_STORAGE_KEY = 'chessLanguage';
        const normalizeLanguage = (lang) => ['ja', 'en', 'zh'].includes(lang) ? lang : 'ja';
        const getSavedLanguage = () => {
            try {
                const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
                return normalizeLanguage(saved);
            } catch (e) {
                return 'ja';
            }
        };

        window.currentLang = getSavedLanguage();
        window.t = (key) => TRANSLATIONS[window.currentLang][key] || key;

        window.setLanguage = (lang, options = {}) => {
            const nextLang = normalizeLanguage(lang);
            window.currentLang = nextLang;
            try {
                if (options.persistLocal !== false) {
                    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
                }
            } catch (e) {}
            const languageSelect = document.getElementById('language-select');
            if (languageSelect && languageSelect.value !== nextLang) {
                languageSelect.value = nextLang;
            }
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = window.t(key);
                } else if (el.tagName === 'OPTION') {
                    el.innerText = window.t(key);
                } else {
                    el.innerText = window.t(key);
                }
            });
            
            const baseSelect = document.getElementById('base-time-select');
            if (baseSelect) {
                Array.from(baseSelect.options).forEach(opt => {
                    const val = parseInt(opt.value);
                    if (val < 60) {
                        opt.innerText = val + window.t('sec');
                    } else {
                        opt.innerText = (val / 60) + window.t('min');
                    }
                });
            }
            const incSelect = document.getElementById('inc-time-select');
            if (incSelect) {
                Array.from(incSelect.options).forEach(opt => {
                    const val = parseInt(opt.value);
                    if (val === 0) {
                        opt.innerText = window.t('incNone');
                    } else {
                        opt.innerText = val + window.t('sec');
                    }
                });
            }

            if (window.game) {
                window.game.onLanguageChanged(nextLang, options);
                window.game.updateLanguageUI();
                window.game.updateProfileUI();
            }
        };

        const myFirebaseConfig = {
            apiKey: "AIzaSyCkUBUExKBbhuMzMnyxZbmrgsfGWK9lTt0",
            authDomain: "chessonline-ab5ac.firebaseapp.com",
            projectId: "chessonline-ab5ac",
            storageBucket: "chessonline-ab5ac.firebasestorage.app",
            messagingSenderId: "1093034532095",
            appId: "1:1093034532095:web:7009f76c02110c6eb080ca",
            measurementId: "G-1KK4ZB1PJS"
        };

        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : myFirebaseConfig;
        
        let app, auth, db, googleProvider = new GoogleAuthProvider(), facebookProvider = new FacebookAuthProvider(), githubProvider = new GithubAuthProvider(), appleProvider = new OAuthProvider('apple.com');
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        facebookProvider.addScope('email');
        facebookProvider.addScope('public_profile');
        githubProvider.addScope('read:user');
        githubProvider.addScope('user:email');
        appleProvider.addScope('email');
        appleProvider.addScope('name');
        const EMAIL_LINK_STORAGE_KEY = 'chessEmailForEmailLink';
        const getEmailLinkContinueUrl = () => {
            try {
                return `${window.location.origin}${window.location.pathname}`;
            } catch (e) {
                return window.location.href.split('?')[0];
            }
        };
        if (Object.keys(firebaseConfig).length > 0) {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);
        }
        
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'my-chess-app-v1';

        const SIZE = 800;
        const CELL = SIZE / 8;
        const COLORS = {
            light: '#eeeed2', dark: '#769656',
            lastMove: 'rgba(186, 202, 43, 0.6)', selected: 'rgba(50, 150, 255, 0.7)',
            validDot: 'rgba(0, 0, 0, 0.15)', captureRing: 'rgba(255, 50, 50, 0.4)'
        };
        
        const PIECES = { 
            'P': '♙\uFE0E', 'R': '♖\uFE0E', 'N': '♘\uFE0E', 'B': '♗\uFE0E', 'Q': '♕\uFE0E', 'K': '♔\uFE0E', 
            'p': '♟\uFE0E', 'r': '♜\uFE0E', 'n': '♞\uFE0E', 'b': '♝\uFE0E', 'q': '♛\uFE0E', 'k': '♚\uFE0E' 
        };
        
        const MATERIAL_VALUES = {
            'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
            'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000
        };
        const AI_VALUES = { ...MATERIAL_VALUES };

        const DISPLAY_MATERIAL_VALUES = {
            'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
            'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0
        };

        class SoundEffects {
            constructor() {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
                
                const unlock = () => {
                    if (this.ctx.state === 'suspended') {
                        this.ctx.resume();
                    }
                    
                    const buffer = this.ctx.createBuffer(1, 1, 22050);
                    const source = this.ctx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(this.ctx.destination);
                    if (source.start) {
                        source.start(0);
                    } else if (source.noteOn) {
                        source.noteOn(0);
                    }

                    document.body.removeEventListener('touchstart', unlock);
                    document.body.removeEventListener('click', unlock);
                };
                
                document.body.addEventListener('touchstart', unlock, { once: true, passive: false });
                document.body.addEventListener('click', unlock, { once: true, passive: false });
            }
            resume() {
                if(this.ctx.state === 'suspended') this.ctx.resume();
            }
            playTone(freq, type, duration, vol=0.1) {
                this.resume();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(vol, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            }
            buttonClick() { this.playTone(600, 'sine', 0.1, 0.05); }
            pieceSelect() { this.playTone(400, 'triangle', 0.1, 0.05); }
            pieceMove()   { this.playTone(200, 'sine', 0.15, 0.1); }
            pieceCapture(){
                this.resume();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.1);
            }
            countdown() { this.playTone(800, 'sine', 0.1, 0.05); }
            check() {
                this.resume();
                this.playTone(880, 'sine', 0.2, 0.1);
                setTimeout(() => this.playTone(880, 'sine', 0.3, 0.1), 100);
            }
            checkmate() {
                this.resume();
                [440, 554.37, 659.25, 880].forEach(f => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = f;
                    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start();
                    osc.stop(this.ctx.currentTime + 2.0);
                });
            }
        }

        class ChessGame {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.sfx = new SoundEffects();
                this.initialized = false;
                this.userId = null;
                this.playerName = "";
                this.currentRoomData = null; 
                this.playerProfile = null; // プレイヤーのELOなどを保存
                this.isLoggedIn = false;
                this.confirmCallback = null;
                this.confirmActiveOverlays = [];
                this.resumePromptHandled = false;
                
                this.roomId = null;
                this.unsubRoom = null;
                this.isHost = false;
                this.previousRankedAdvantage = 0;
                
                this.moveCount = 0; 
                this.gameMode = null; 
                
                this.turnStartTime = 0;
                this.baseTimers = { white: 0, black: 0 };
                this.initialTimeSec = 600;
                this.baseAiElo = 250;

                this.board = [];
                this.turn = 'white';
                this.timers = { white: 0, black: 0 };
                this.timerInterval = null;
                this.heartbeatInterval = null;
                this.history = [];
                this.animatingPiece = null;
                
                this.draggingPiece = null;
                this.isThinkingForCpu = false;
                this.isAssistModeThinking = false;
                this.tempAssistMoves = [];
                this.tempCpuMoves = [];

                this.movedStatus = {
                    whiteKing: false, blackKing: false,
                    whiteRookLeft: false, whiteRookRight: false,
                    blackRookLeft: false, blackRookRight: false
                };
                this.kingHasBeenInCheck = { white: false, black: false };
                this.confirmCallback = null;
                this.confirmActiveOverlays = [];
                this.enPassantTarget = null;
                this.isAssistMode = false;
                this.assistMoves = [];
                this.validMoves = [];
                this.inCheckPos = null;
                this.firstMoveDone = { white: false, black: false };
                
                this.halfMoveClock = 0;
                this.positionHistory = [];
                this.opponentAckTime = null;
                this.isOpponentDisconnected = false;
                this.opponentDisconnectedAt = null;
                this.lastPersistentSaveAt = 0;
                this.boardCursor = { x: 3, y: 6 };
                this.keyboardEditElement = null;

                this.needsRender = true;
                
                this.autoRotate = false;

                this.setupListeners();
                this.setupConfirmHandlers();
                this.initStockfish();
                this.animate();

                setTimeout(() => window.setLanguage(window.currentLang), 100);

                window.addEventListener('beforeunload', () => {
                    this.saveGameState();
                });
            }

            async loadProfile() {
                if (!this.userId || !db) return;
                if (!this.isLoggedIn) {
                    this.playerProfile = null;
                    this.updateProfileUI();
                    return;
                }

                try {
                    const profileRef = doc(db, 'artifacts', appId, 'users', this.userId, 'profile', 'data');
                    const snap = await getDoc(profileRef);
                    if (snap.exists()) {
                        this.playerProfile = snap.data();
                        if (this.playerProfile.elo === undefined) this.playerProfile.elo = 250;
                    } else {
                        // 新規プレイヤーの初期レートは250に設定
                        this.playerProfile = { elo: 250 };
                        await setDoc(profileRef, this.playerProfile);
                    }
                    this.playerProfile.displayName = this.playerProfile.displayName || (auth && auth.currentUser && auth.currentUser.displayName) || 'Player';

                    // ID が未割り当てなら一意の英数字IDを割り当てて固定保存する
                    if (!this.playerProfile.usernameSuffix) {
                        try {
                            let created = false;
                            for (let attempt = 0; attempt < 50 && !created; attempt++) {
                                const suffix = this.generateUsernameSuffix(8);
                                const suffixRef = doc(db, 'artifacts', appId, 'usernames', suffix);
                                try {
                                    await runTransaction(db, async (tx) => {
                                        const existing = await tx.get(suffixRef);
                                        if (existing.exists()) throw new Error('exists');
                                        tx.set(suffixRef, { uid: this.userId, displayName: this.playerProfile.displayName, updatedAt: Date.now() });
                                    });
                                    await setDoc(profileRef, {
                                        ...this.playerProfile,
                                        displayName: this.playerProfile.displayName,
                                        usernameSuffix: suffix,
                                        username: `${this.playerProfile.displayName}-${suffix}`,
                                        usernameLocked: true
                                    }, { merge: true });
                                    this.playerProfile.usernameSuffix = suffix;
                                    this.playerProfile.username = `${this.playerProfile.displayName}-${suffix}`;
                                    this.playerProfile.usernameLocked = true;
                                    created = true;
                                } catch (assignError) {
                                    try { await deleteDoc(suffixRef); } catch (_) {}
                                    if (assignError.message !== 'exists') throw assignError;
                                }
                            }
                            if (!created) throw new Error('username assign failed');
                        } catch(e) { console.error('username assign failed', e); }
                    }
                    if (this.playerProfile.username && !this.playerProfile.usernameSuffix) {
                        const parts = this.playerProfile.username.split('-');
                        this.playerProfile.usernameSuffix = parts.length > 1 ? parts[parts.length - 1] : this.playerProfile.username;
                    }
                    if (!this.playerProfile.username) {
                        this.playerProfile.username = `${this.playerProfile.displayName}-${this.playerProfile.usernameSuffix || ''}`.replace(/-$/, '');
                    }
                    if (this.playerProfile.usernameSuffix) {
                        this.playerProfile.usernameSuffix = String(this.playerProfile.usernameSuffix);
                    }

                    const resolvedLanguage = normalizeLanguage(this.playerProfile.language || window.currentLang || getSavedLanguage());
                    const languageWasMissing = !this.playerProfile.language;
                    this.playerProfile.language = resolvedLanguage;
                    if (window.currentLang !== resolvedLanguage) {
                        window.setLanguage(resolvedLanguage, { persistLocal: true, persistProfile: false });
                    }
                    if (languageWasMissing) {
                        this.persistLanguagePreference(resolvedLanguage).catch(console.error);
                    }

                    this.updateProfileUI();
                    this.tryRestoreGame();
                    
                    // レートが他デバイス等で更新された時のために監視
                    onSnapshot(profileRef, (docSnap) => {
                        if (docSnap.exists()) {
                            this.playerProfile = docSnap.data();
                            this.updateProfileUI();
                            const nextLanguage = normalizeLanguage(this.playerProfile.language || window.currentLang || getSavedLanguage());
                            this.playerProfile.language = nextLanguage;
                            if (window.currentLang !== nextLanguage) {
                                window.setLanguage(nextLanguage, { persistLocal: true, persistProfile: false });
                            }
                        }
                    }, (err) => console.error(err));
                    
                } catch(e) { console.error(e); }
            }

            async persistLanguagePreference(lang) {
                if (!this.isLoggedIn || !this.userId || !db) return false;
                const nextLang = normalizeLanguage(lang);
                if (this.playerProfile) {
                    this.playerProfile.language = nextLang;
                }

                try {
                    const profileRef = doc(db, 'artifacts', appId, 'users', this.userId, 'profile', 'data');
                    await updateDoc(profileRef, { language: nextLang }).catch(async () => {
                        await setDoc(profileRef, {
                            ...(this.playerProfile || {}),
                            language: nextLang
                        }, { merge: true }).catch(console.error);
                    });
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            }

            onLanguageChanged(lang, options = {}) {
                if (this.playerProfile) {
                    this.playerProfile.language = normalizeLanguage(lang);
                }

                if (options.persistProfile === false) {
                    return;
                }

                if (this.isLoggedIn && this.userId && db) {
                    this.persistLanguagePreference(lang);
                }
            }

            getProfileIdentity() {
                const fallbackName = this.playerProfile?.displayName || "Player";
                const suffix = this.playerProfile?.usernameSuffix || "";
                const displayName = this.playerProfile?.displayName || fallbackName;
                return { displayName, suffix, full: suffix ? `${displayName}-${suffix}` : displayName };
            }
            
            updateProfileUI() {
                const section = document.getElementById('profile-section');
                const eloDisplay = document.getElementById('display-elo');
                const nameDisplay = document.getElementById('display-username');
                if (this.playerProfile && section && eloDisplay) {
                    section.style.display = 'block';
                    eloDisplay.innerText = this.playerProfile.elo;
                    const identity = this.getProfileIdentity();
                    if (nameDisplay) nameDisplay.innerText = identity.full;
                } else if (section) {
                    section.style.display = 'none';
                }
                
                // オンライン設定画面の username も更新
                const onlineNameDisplay = document.getElementById('online-display-name');
                const onlineIdDisplay = document.getElementById('online-display-id');
                if (this.playerProfile) {
                    const identity = this.getProfileIdentity();
                    if (onlineNameDisplay) onlineNameDisplay.innerText = identity.displayName;
                    if (onlineIdDisplay) onlineIdDisplay.innerText = `${window.t('profileIdLabel')}: ${identity.suffix || '---'}`;
                } else {
                    if (onlineNameDisplay) onlineNameDisplay.innerText = '---';
                    if (onlineIdDisplay) onlineIdDisplay.innerText = `${window.t('profileIdLabel')}: ---`;
                }
            }

            async changeDisplayName() {
                return this.changeOnlineIdentity();
            }

            async regenerateSuffix() {
                return this.changeOnlineIdentity();
            }

            randomString(length) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const values = new Uint32Array(length);
                crypto.getRandomValues(values);
                return Array.from(values, value => chars[value % chars.length]).join('');
            }

            generateUsernameSuffix(length = 8) {
                return this.randomString(length);
            }

            async generateUniqueUsernameSuffix(length = 8) {
                if (!db) return this.generateUsernameSuffix(length);
                for (let attempt = 0; attempt < 50; attempt++) {
                    const suffix = this.generateUsernameSuffix(length);
                    const suffixRef = doc(db, 'artifacts', appId, 'usernames', suffix);
                    const snap = await getDoc(suffixRef);
                    if (!snap.exists()) return suffix;
                }
                throw new Error('unique_id_generation_failed');
            }

            openIdentityModal() {
                if (!this.isLoggedIn || !this.userId || !this.playerProfile) {
                    return this.showConfirm(window.t('error'), window.t('authStatusPreparing'), ()=>{}, true);
                }
                const identity = this.getProfileIdentity();
                const nameInput = document.getElementById('identity-name-input');
                const idInput = document.getElementById('identity-id-input');
                if (nameInput) nameInput.value = identity.displayName || 'Player';
                if (idInput) idInput.value = identity.suffix || '';
                this.hideAllOverlays();
                const modal = document.getElementById('identity-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    setTimeout(() => nameInput?.focus(), 0);
                }
            }

            openEmailLinkRegistrationModal(email) {
                if (!this.isLoggedIn || !this.userId) {
                    return;
                }
                const modal = document.getElementById('email-link-registration-modal');
                const emailDisplay = document.getElementById('email-link-registration-email');
                const nameInput = document.getElementById('email-link-registration-name');
                const idInput = document.getElementById('email-link-registration-id');
                const passwordInput = document.getElementById('email-link-registration-password');
                const passwordConfirmInput = document.getElementById('email-link-registration-password-confirm');
                if (emailDisplay) emailDisplay.innerText = email || '';
                if (nameInput) nameInput.value = '';
                if (idInput) idInput.value = '';
                if (passwordInput) passwordInput.value = '';
                if (passwordConfirmInput) passwordConfirmInput.value = '';
                this.hideAllOverlays();
                if (modal) {
                    modal.style.display = 'flex';
                    setTimeout(() => nameInput?.focus(), 0);
                }
            }

            async randomizeEmailLinkRegistrationId() {
                const idInput = document.getElementById('email-link-registration-id');
                if (!idInput) return;
                try {
                    idInput.value = await this.generateUniqueUsernameSuffix(8);
                } catch (e) {
                    console.error(e);
                    alert('IDの生成に失敗しました');
                }
            }

            async submitEmailLinkRegistration() {
                if (!auth?.currentUser || !this.userId) return;

                const email = auth.currentUser.email || emailLinkRegistrationEmail || '';
                const nameInput = document.getElementById('email-link-registration-name');
                const idInput = document.getElementById('email-link-registration-id');
                const passwordInput = document.getElementById('email-link-registration-password');
                const passwordConfirmInput = document.getElementById('email-link-registration-password-confirm');

                const newDisplayName = (nameInput?.value || '').trim().replace(/[\r\n\t]/g, ' ').replace(/-/g, '');
                let newSuffix = (idInput?.value || '').trim().replace(/[^A-Za-z0-9]/g, '');
                const password = passwordInput?.value || '';
                const passwordConfirm = passwordConfirmInput?.value || '';

                if (!newDisplayName) {
                    alert('ユーザーネームを入力してください');
                    return;
                }
                if (!newSuffix) {
                    try {
                        newSuffix = await this.generateUniqueUsernameSuffix(8);
                        if (idInput) idInput.value = newSuffix;
                    } catch (e) {
                        console.error(e);
                        alert('IDの生成に失敗しました');
                        return;
                    }
                }
                if (!password) {
                    alert('パスワードを入力してください');
                    return;
                }
                if (password.length < 6) {
                    alert('パスワードは6文字以上にしてください');
                    return;
                }
                if (password !== passwordConfirm) {
                    alert('パスワードが一致しません');
                    return;
                }
                if (!email) {
                    alert('Eメールアドレスが見つかりません');
                    return;
                }

                const profileRef = doc(db, 'artifacts', appId, 'users', this.userId, 'profile', 'data');
                const suffixRef = doc(db, 'artifacts', appId, 'usernames', newSuffix);

                try {
                    const credential = EmailAuthProvider.credential(email, password);
                    await linkWithCredential(auth.currentUser, credential);
                    await updateProfile(auth.currentUser, { displayName: newDisplayName }).catch(() => {});

                    await runTransaction(db, async (tx) => {
                        const existing = await tx.get(suffixRef);
                        if (existing.exists() && existing.data().uid !== this.userId) {
                            throw new Error('id_taken');
                        }
                        tx.set(suffixRef, { uid: this.userId, displayName: newDisplayName, updatedAt: Date.now() });
                    });

                    try {
                        await setDoc(profileRef, {
                            elo: this.playerProfile?.elo ?? 250,
                            displayName: newDisplayName,
                            usernameSuffix: newSuffix,
                            username: `${newDisplayName}-${newSuffix}`,
                            usernameLocked: true,
                            language: window.currentLang,
                            email: email
                        }, { merge: true });
                    } catch (profileError) {
                        await deleteDoc(suffixRef).catch(() => {});
                        throw profileError;
                    }

                    emailLinkRegistrationPending = false;
                    emailLinkRegistrationEmail = '';
                    localStorage.removeItem(EMAIL_LINK_STORAGE_KEY);

                    this.playerProfile = {
                        ...(this.playerProfile || {}),
                        elo: this.playerProfile?.elo ?? 250,
                        displayName: newDisplayName,
                        usernameSuffix: newSuffix,
                        username: `${newDisplayName}-${newSuffix}`,
                        usernameLocked: true,
                        language: window.currentLang,
                        email: email
                    };
                    this.updateProfileUI();
                    this.updateAuthDependentUI();

                    const modal = document.getElementById('email-link-registration-modal');
                    if (modal) modal.style.display = 'none';
                    await this.loadProfile();
                } catch (e) {
                    console.error(e);
                    if (e?.message === 'id_taken') {
                        alert('そのIDは既に使われています');
                    } else if (e?.code === 'auth/credential-already-in-use') {
                        alert('そのEメールアドレスは既に使用されています');
                    } else if (e?.code === 'auth/weak-password') {
                        alert('パスワードが弱すぎます');
                    } else {
                        alert(`登録に失敗しました: ${e?.message || e}`);
                    }
                }
            }

            closeIdentityModal() {
                const modal = document.getElementById('identity-modal');
                if (modal) modal.style.display = 'none';
                this.hideAllOverlays();
                document.getElementById('settings-modal').style.display = 'flex';
                this.updateGameUiInteractivity();
                setTimeout(() => this.focusFirstOverlayElement('settings-modal'), 0);
            }

            openSettingsModal() {
                if (!this.isLoggedIn || !this.userId || !this.playerProfile) {
                    return this.showConfirm(window.t('error'), window.t('authStatusPreparing'), ()=>{}, true);
                }
                this.hideAllOverlays();
                const modal = document.getElementById('settings-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    const deletePanel = document.getElementById('delete-account-panel');
                    const deleteInput = document.getElementById('delete-account-id-input');
                    if (deletePanel) deletePanel.style.display = 'none';
                    if (deleteInput) deleteInput.value = '';
                    this.updateGameUiInteractivity();
                    setTimeout(() => this.focusFirstOverlayElement('settings-modal'), 0);
                }
            }

            closeSettingsModal() {
                const modal = document.getElementById('settings-modal');
                if (modal) modal.style.display = 'none';
                const deletePanel = document.getElementById('delete-account-panel');
                const deleteInput = document.getElementById('delete-account-id-input');
                if (deletePanel) deletePanel.style.display = 'none';
                if (deleteInput) deleteInput.value = '';
                this.hideAllOverlays();
                document.getElementById('mode-selection').style.display = 'flex';
                this.updateGameUiInteractivity();
                setTimeout(() => this.focusFirstOverlayElement('mode-selection'), 0);
            }

            async randomizeIdentityId() {
                if (!this.isLoggedIn || !this.userId || !this.playerProfile) return;
                const idInput = document.getElementById('identity-id-input');
                if (!idInput) return;
                try {
                    idInput.value = await this.generateUniqueUsernameSuffix(8);
                } catch (e) {
                    console.error(e);
                    alert('IDの生成に失敗しました');
                }
            }

            async saveIdentityModal() {
                if (!this.isLoggedIn || !this.userId || !this.playerProfile) return;
                const nameInput = document.getElementById('identity-name-input');
                const idInput = document.getElementById('identity-id-input');
                const newDisplayName = (nameInput?.value || '').trim().replace(/[\r\n\t]/g, ' ').replace(/-/g, '');
                let newSuffix = (idInput?.value || '').trim().replace(/[^A-Za-z0-9]/g, '');

                if (!newDisplayName) {
                    alert('名前を入力してください');
                    return;
                }
                if (!newSuffix) {
                    try {
                        newSuffix = await this.generateUniqueUsernameSuffix(8);
                        if (idInput) idInput.value = newSuffix;
                    } catch (e) {
                        console.error(e);
                        alert('IDの生成に失敗しました');
                        return;
                    }
                }

                const profileRef = doc(db, 'artifacts', appId, 'users', this.userId, 'profile', 'data');
                const suffixRef = doc(db, 'artifacts', appId, 'usernames', newSuffix);
                const currentSuffix = this.playerProfile.usernameSuffix || "";
                const currentSuffixRef = currentSuffix ? doc(db, 'artifacts', appId, 'usernames', currentSuffix) : null;

                try {
                    await runTransaction(db, async (tx) => {
                        const existing = await tx.get(suffixRef);
                        if (existing.exists() && existing.data().uid !== this.userId) {
                            throw new Error('id_taken');
                        }
                        tx.set(suffixRef, { uid: this.userId, displayName: newDisplayName, updatedAt: Date.now() });
                    });

                    try {
                        await setDoc(profileRef, {
                            ...this.playerProfile,
                            displayName: newDisplayName,
                            usernameSuffix: newSuffix,
                            username: `${newDisplayName}-${newSuffix}`,
                            usernameLocked: true
                        }, { merge: true });
                    } catch (profileError) {
                        await deleteDoc(suffixRef).catch(() => {});
                        throw profileError;
                    }

                    if (currentSuffixRef && currentSuffix !== newSuffix) {
                        await deleteDoc(currentSuffixRef).catch(() => {});
                    }

                    this.playerProfile.displayName = newDisplayName;
                    this.playerProfile.usernameSuffix = newSuffix;
                    this.playerProfile.username = `${newDisplayName}-${newSuffix}`;
                    this.playerProfile.usernameLocked = true;
                    this.playerName = this.playerProfile.username;
                    this.updateProfileUI();
                    this.closeIdentityModal();
                } catch (e) {
                    console.error(e);
                    if (e.message === 'id_taken') {
                        alert('そのIDは既に使われています');
                    } else {
                        alert(`名前/idの変更に失敗しました: ${e?.message || e}`);
                    }
                }
            }

            async changeOnlineIdentity() {
                this.openIdentityModal();
            }

            async handleSettingsLogout() {
                if (!auth) return;
                this.closeSettingsModal();
                try {
                    await signOut(auth);
                    await signInAnonymously(auth);
                } catch (e) {
                    console.error('Settings logout error:', e);
                    this.showConfirm(window.t('commError'), `${window.t('error')}\n${e?.message || e}`, ()=>{}, true);
                }
            }

            openDeleteAccountPanel() {
                const panel = document.getElementById('delete-account-panel');
                const input = document.getElementById('delete-account-id-input');
                if (!panel || !input) return;
                panel.style.display = 'flex';
                input.value = '';
                setTimeout(() => input.focus(), 0);
            }

            cancelDeleteAccountPanel() {
                const panel = document.getElementById('delete-account-panel');
                const input = document.getElementById('delete-account-id-input');
                if (panel) panel.style.display = 'none';
                if (input) input.value = '';
                setTimeout(() => this.focusFirstOverlayElement('settings-modal'), 0);
            }

            verifyDeleteAccountId() {
                const input = document.getElementById('delete-account-id-input');
                const typedId = (input?.value || '').trim();
                const identity = this.getProfileIdentity();
                const authUid = auth?.currentUser?.uid || '';
                const expectedIds = new Set([
                    authUid.trim(),
                    (this.userId || '').trim(),
                    (this.playerProfile?.usernameSuffix || '').trim(),
                    (this.playerProfile?.username || '').trim(),
                    (identity.full || '').trim()
                ].filter(Boolean));
                const normalizedTypedId = typedId.toLowerCase();
                const normalizedExpectedIds = new Set(Array.from(expectedIds).map(id => id.toLowerCase()));
                if (!normalizedTypedId || !normalizedExpectedIds.has(normalizedTypedId)) {
                    this.showConfirm(window.t('error'), window.t('deleteAccountIdMismatch'), ()=>{}, true);
                    return;
                }
                this.showConfirm(
                    window.t('deleteAccountConfirmTitle'),
                    window.t('deleteAccountConfirmMsg'),
                    async () => {
                        await this.deleteCurrentAccount();
                    }
                );
            }

            async reauthenticateForSensitiveAction() {
                if (!auth || !auth.currentUser) return false;
                try {
                    const currentUser = auth.currentUser;
                    const providerId = currentUser.providerData.find(p => p.providerId && p.providerId !== 'firebase')?.providerId || 'google.com';
                    if (providerId === 'password') {
                        const email = currentUser.email || window.prompt('Eメールアドレスを入力してください');
                        if (!email) return false;
                        const password = window.prompt('パスワードを入力してください');
                        if (!password) return false;
                        const credential = EmailAuthProvider.credential(email.trim(), password);
                        await reauthenticateWithCredential(currentUser, credential);
                    } else {
                        const provider = providerId === 'facebook.com'
                            ? facebookProvider
                            : providerId === 'github.com'
                                ? githubProvider
                                : providerId === 'apple.com'
                                    ? appleProvider
                                    : (googleProvider || new GoogleAuthProvider());
                        googleProvider = googleProvider || provider;
                        await reauthenticateWithPopup(currentUser, provider);
                    }
                    return true;
                } catch (e) {
                    console.error('Reauthentication failed:', e);
                    this.showConfirm(window.t('error'), `${window.t('commError')}\n${e?.message || e}`, ()=>{}, true);
                    return false;
                }
            }

            async deleteCurrentAccount() {
                if (!auth || !this.userId) return;
                const currentUid = this.userId;
                const currentSuffix = this.playerProfile?.usernameSuffix || "";
                const finalizeDeletion = async () => {
                    this.clearSession();
                    await this.clearPersistentGameState().catch(() => {});
                    this.playerProfile = null;
                    this.updateProfileUI();
                    this.updateAuthDependentUI();
                    this.closeSettingsModal();
                };
                try {
                    const currentUser = auth.currentUser;
                    const needsReauth = !!currentUser && !currentUser.isAnonymous;
                    if (needsReauth) {
                        const reauthed = await this.reauthenticateForSensitiveAction();
                        if (!reauthed) return;
                    }

                    const profileRef = doc(db, 'artifacts', appId, 'users', currentUid, 'profile', 'data');
                    const usernameRef = currentSuffix ? doc(db, 'artifacts', appId, 'usernames', currentSuffix) : null;
                    const userToDelete = auth.currentUser;

                    if (usernameRef) {
                        await deleteDoc(usernameRef).catch(() => {});
                    }
                    await deleteDoc(profileRef).catch(() => {});
                    if (userToDelete) {
                        await deleteUser(userToDelete);
                    }
                    await finalizeDeletion();
                } catch (e) {
                    if (e?.code === 'auth/requires-recent-login') {
                        const reauthed = await this.reauthenticateForSensitiveAction();
                        if (reauthed) {
                            const freshUser = auth?.currentUser;
                            if (freshUser) {
                                await deleteUser(freshUser);
                            }
                            await finalizeDeletion();
                            return;
                        }
                    }
                    console.error(e);
                    this.showConfirm(window.t('commError'), `${window.t('error')}\n${e?.message || e}`, ()=>{}, true);
                }
            }

            updateAuthDependentUI() {
                const rankedBtn = document.getElementById('ranked-match-btn');
                const onlineBtn = document.getElementById('online-pvp-btn');
                const loginInfo = document.getElementById('login-required-info');

                if (this.isLoggedIn) {
                    if (rankedBtn) rankedBtn.style.display = 'inline-block';
                    if (onlineBtn) onlineBtn.style.display = 'inline-block';
                    if (loginInfo) loginInfo.style.display = 'none';
                } else {
                    if (rankedBtn) rankedBtn.style.display = 'none';
                    if (onlineBtn) onlineBtn.style.display = 'none';
                    if (loginInfo) loginInfo.style.display = 'block';
                }
            }

            // 特製対局調整ELOスコアを保存する関数 (勝ち負け関係なく、その対局に達した実力(ELO)をそのまま適用)
            updateRankedScore() {
                if (this.gameMode !== 'cpu_ranked' || !this.isLoggedIn || !this.userId || !this.playerProfile) return "";
                if (!this.isGameOver) return "";
                
                const oldElo = this.rankedStartElo ?? this.playerProfile.elo ?? 250;
                const newElo = this.aiElo; // 対局終了または切断時の、動的調整された推定ELOを直接採用（上限撤廃）
                
                this.playerProfile.elo = newElo;
                
                try {
                    const profileRef = doc(db, 'artifacts', appId, 'users', this.userId, 'profile', 'data');
                    updateDoc(profileRef, { elo: newElo }).catch(e => {
                        setDoc(profileRef, this.playerProfile).catch(console.error);
                    });
                } catch(e) { console.error(e); }
                
                const diff = newElo - oldElo;
                const diffStr = diff >= 0 ? `+${diff}` : `${diff}`;
                return `\n[ELO: ${oldElo} ➔ ${newElo} (${diffStr})]`;
            }

            startRankedCpu() {
                this.sfx.buttonClick();
                if (!this.isLoggedIn) {
                    this.showConfirm(window.t('error'), window.t('loginRequiredInfo'), ()=>{}, true);
                    return;
                }
                if (!this.playerProfile) {
                    this.showConfirm(window.t('error'), window.t('connectingMsg'), ()=>{}, true);
                    return;
                }
                
                this.gameMode = 'cpu_ranked';
                const oldElo = this.playerProfile.elo || 250;
                
                // 設定レートから適切な内部AIレベルを計算
                this.aiElo = oldElo;
                this.aiLevel = Math.max(1, Math.min(50, Math.round((oldElo - 250) / 45.9) + 1));
                this.baseAiLevel = this.aiLevel;
                this.baseAiElo = oldElo;
                this.rankedStartElo = oldElo;
                
                // ランクマッチは 10分 + 5秒固定 の真剣勝負
                this.initialTimeSec = 600; 
                this.timers = { white: 600, black: 600 };
                this.increment = 5; 
                this.useTimer = true;
                this.isAssistMode = false;
                
                this.hideAllOverlays();
                
                document.getElementById('undo-btn').style.display = 'none'; // ランク戦は待ったなし
                document.getElementById('rematch-btn').style.display = 'none';
                document.getElementById('meter-ui').style.display = 'flex';
                document.getElementById('assist-mode-container').style.display = 'none'; // アシストなし
                document.getElementById('auto-rotate-container').style.display = 'none';
                
                const topTimer = document.getElementById('timer-top');
                const bottomTimer = document.getElementById('timer-bottom');
                
                this.playerColor = Math.random() < 0.5 ? 'white' : 'black';
                this.updatePlayerLabels();

                topTimer.style.display = 'inline-block';
                bottomTimer.style.display = 'inline-block';
                this.updateTimerDisplay();

                this.initGame();
                this.startTimer();
                this.saveGameState();
                
                if (this.playerColor === 'black') {
                    // エラー回避のため絶対パスで呼び出し
                    setTimeout(() => { if (window.game) window.game.cpuMove(); }, 800);
                }
            }

            saveGameState() {
                const isPersistentMode = this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked';
                if (!isPersistentMode) {
                    return;
                }

                if (this.isGameOver || !this.gameMode || !this.initialized) {
                    this.clearPersistentGameState();
                    return;
                }

                const state = {
                    board: this.board,
                    turn: this.turn,
                    timers: this.timers,
                    baseTimers: this.baseTimers,
                    halfMoveClock: this.halfMoveClock,
                    moveCount: this.moveCount,
                    positionHistory: this.positionHistory,
                    movedStatus: this.movedStatus,
                    kingHasBeenInCheck: this.kingHasBeenInCheck,
                    enPassantTarget: this.enPassantTarget,
                    firstMoveDone: this.firstMoveDone,
                    playerColor: this.playerColor,
                    gameMode: this.gameMode,
                    aiLevel: this.aiLevel,
                    aiElo: this.aiElo,
                    baseAiLevel: this.baseAiLevel,
                    baseAiElo: this.baseAiElo,
                    rankedStartElo: this.rankedStartElo,
                    increment: this.increment,
                    useTimer: this.useTimer,
                    isAssistMode: this.isAssistMode,
                    history: this.history,
                    lastMove: this.lastMove,
                    initialTimeSec: this.initialTimeSec
                };

                if (isPersistentMode && this.isLoggedIn && this.userId && db) {
                    localStorage.setItem('chessGameState', JSON.stringify(state));
                    if (this.playerProfile) {
                        this.playerProfile.resumeGameState = state;
                        this.playerProfile.resumeGameStateUpdatedAt = Date.now();
                    }
                    try {
                        const profileRef = doc(db, 'artifacts', appId, 'users', this.userId, 'profile', 'data');
                        updateDoc(profileRef, {
                            resumeGameState: state,
                            resumeGameStateUpdatedAt: Date.now()
                        }).catch(async () => {
                            await setDoc(profileRef, {
                                ...(this.playerProfile || {}),
                                resumeGameState: state,
                                resumeGameStateUpdatedAt: Date.now()
                            }, { merge: true }).catch(console.error);
                        });
                    } catch (e) { console.error(e); }
                } else {
                    sessionStorage.setItem('chessGameState', JSON.stringify(state));
                }
                this.lastPersistentSaveAt = Date.now();
            }

            tryRestoreGame() {
                return this.promptResumeGame();
            }

            getStoredResumeState() {
                let state = null;
                try {
                    const localState = localStorage.getItem('chessGameState');
                    if (localState) state = JSON.parse(localState);
                } catch (e) {
                    console.error(e);
                }

                if (!state && this.playerProfile?.resumeGameState) {
                    state = this.playerProfile.resumeGameState;
                }

                return state;
            }

            promptResumeGame() {
                if (this.resumePromptHandled || !this.isLoggedIn || !this.playerProfile || this.initialized || this.gameMode === 'online') {
                    return false;
                }

                const state = this.getStoredResumeState();
                if (!state || (state.gameMode !== 'cpu' && state.gameMode !== 'cpu_ranked')) {
                    return false;
                }

                this.resumePromptHandled = true;
                const noBtn = document.getElementById('confirm-no');
                if (noBtn) {
                    const declineHandler = () => {
                        this.clearPersistentGameState();
                    };
                    noBtn.addEventListener('click', declineHandler, { once: true });
                }
                this.showConfirm(window.t('resumeGameTitle'), window.t('resumeGameMsg'), async () => {
                    this.restoreGameState(state);
                });
                return true;
            }

            restoreGameState(state) {
                try {
                    this.board = state.board;
                    this.turn = state.turn;
                    this.timers = state.timers;
                    this.baseTimers = state.baseTimers;
                    this.halfMoveClock = state.halfMoveClock;
                    this.moveCount = state.moveCount;
                    this.positionHistory = state.positionHistory;
                    this.movedStatus = state.movedStatus;
                    this.kingHasBeenInCheck = state.kingHasBeenInCheck || { white: false, black: false };
                    this.enPassantTarget = state.enPassantTarget;
                    this.firstMoveDone = state.firstMoveDone;
                    this.playerColor = state.playerColor;
                    this.gameMode = state.gameMode;
                    this.aiLevel = state.aiLevel;
                    this.aiElo = state.aiElo || 250;
                    this.baseAiLevel = state.baseAiLevel || state.aiLevel;
                    this.baseAiElo = state.baseAiElo || (this.baseAiLevel ? 250 + (this.baseAiLevel - 1) * 45 : this.aiElo || 250);
                    this.rankedStartElo = state.rankedStartElo ?? this.baseAiElo;
                    this.increment = state.increment;
                    this.useTimer = state.useTimer;
                    this.isAssistMode = state.isAssistMode;
                    this.history = state.history || [];
                    this.lastMove = state.lastMove || null;
                    this.initialTimeSec = state.initialTimeSec || 600;
                    this.boardCursor = this.lastMove ? { x: this.lastMove.to.x, y: this.lastMove.to.y } : (this.playerColor === 'black' ? { x: 3, y: 1 } : { x: 3, y: 6 });
                    
                    this.isGameOver = false;
                    this.initialized = true;

                    this.hideAllOverlays();
                    
                    if (this.gameMode === 'cpu_ranked') {
                        document.getElementById('undo-btn').style.display = 'none';
                        document.getElementById('assist-mode-container').style.display = 'none';
                    } else {
                        document.getElementById('undo-btn').style.display = 'inline-block';
                        document.getElementById('assist-mode-container').style.display = 'flex';
                    }
                    
                    document.getElementById('rematch-btn').style.display = 'none';
                    document.getElementById('meter-ui').style.display = 'flex';
                    
                    if (this.gameMode === 'pvp') {
                        document.getElementById('auto-rotate-container').style.display = 'flex';
                    } else {
                        document.getElementById('auto-rotate-container').style.display = 'none';
                    }

                    const topTimer = document.getElementById('timer-top');
                    const bottomTimer = document.getElementById('timer-bottom');
                    
                    this.updatePlayerLabels();

                    if (this.useTimer) {
                        topTimer.style.display = 'inline-block';
                        bottomTimer.style.display = 'inline-block';
                        this.updateTimerDisplay();
                    } else {
                        topTimer.style.display = 'none';
                        bottomTimer.style.display = 'none';
                    }

                    this.startTimer();
                    this.updateAdvantageMeter();
                    this.updateMoveCountDisplay();
                    this.updateRotationUI();
                    
                    this.updateCheckStatus();
                    const checkStr = this.inCheckPos ? window.t('checkWarning') : "";
                    this.showTurnMessage(checkStr);
                    this.lastPersistentSaveAt = Date.now();

                    if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') && this.turn !== this.playerColor) {
                        setTimeout(() => { if (window.game) window.game.cpuMove(); }, 800);
                    } else if (this.gameMode !== 'cpu_ranked') {
                        this.updateAssistMoves();
                    }

                    this.needsRender = true;
                    return true;
                } catch (e) {
                    console.error("復元に失敗しました", e);
                    this.clearPersistentGameState();
                    return false;
                }
            }

            async clearPersistentGameState() {
                sessionStorage.removeItem('chessGameState');
                localStorage.removeItem('chessGameState');

                if (this.isLoggedIn && this.userId && db) {
                    try {
                        const profileRef = doc(db, 'artifacts', appId, 'users', this.userId, 'profile', 'data');
                        await updateDoc(profileRef, {
                            resumeGameState: deleteField(),
                            resumeGameStateUpdatedAt: deleteField()
                        }).catch(async () => {
                            await setDoc(profileRef, {
                                ...(this.playerProfile || {}),
                                resumeGameState: null,
                                resumeGameStateUpdatedAt: null
                            }, { merge: true }).catch(() => {});
                        });
                        if (this.playerProfile) {
                            this.playerProfile.resumeGameState = null;
                            this.playerProfile.resumeGameStateUpdatedAt = null;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                this.lastPersistentSaveAt = 0;
            }

            async initStockfish() {
                try {
                    const stockfishUrl = "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";
                    const response = await fetch(stockfishUrl);
                    if (!response.ok) {
                        throw new Error(`Failed to load Stockfish from ${stockfishUrl}`);
                    }
                    const stockfishSource = await response.text();
                    const blob = new Blob([stockfishSource], {type: "application/javascript"});
                    this.stockfish = new Worker(URL.createObjectURL(blob));

                    this.stockfish.onmessage = (event) => {
                        const line = event.data;
                        if (typeof line === 'string') {
                            if (line.startsWith("bestmove")) {
                                if (this.isThinkingForCpu) {
                                    this.isThinkingForCpu = false;
                                    
                                    let chosenMoveStr = null;
                                    if (this.tempCpuMoves && this.tempCpuMoves.length > 0) {
                                        const validMoves = this.tempCpuMoves.filter(Boolean);
                                        if (validMoves.length > 0) {
                                            const weights = this.getCpuMoveWeights(validMoves.length);
                                            const rand = Math.random();
                                            let sum = 0;
                                            let selectedIndex = 0;
                                            for(let i=0; i<validMoves.length; i++) {
                                                sum += weights[i];
                                                if (rand <= sum) {
                                                    selectedIndex = i;
                                                    break;
                                                }
                                            }
                                            chosenMoveStr = validMoves[selectedIndex];
                                        }
                                    }

                                    if (!chosenMoveStr) {
                                        const match = line.match(/bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
                                        if (match) {
                                            chosenMoveStr = match[1];
                                        }
                                    }

                                    if (chosenMoveStr) {
                                        this.handleEngineMove(chosenMoveStr);
                                    } else {
                                        this.fallbackCpuMove();
                                    }
                                } else if (this.isAssistModeThinking) {
                                    this.isAssistModeThinking = false;
                                    this.assistMoves = [...this.tempAssistMoves].filter(Boolean);
                                    this.needsRender = true;
                                }
                            } else if (line.includes("info") && line.includes("multipv")) {
                                const multipvMatch = line.match(/multipv\s+(\d+)/);
                                const pvMatch = line.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
                                
                                if (multipvMatch && pvMatch) {
                                    const multipv = parseInt(multipvMatch[1]);
                                    const moveStr = pvMatch[1];
                                    
                                    if (this.isAssistModeThinking) {
                                        const move = this.parseUCI(moveStr);
                                        if (move) {
                                            this.tempAssistMoves[multipv - 1] = move;
                                        }
                                    } else if (this.isThinkingForCpu) {
                                        this.tempCpuMoves[multipv - 1] = moveStr;
                                    }
                                }
                            }
                        }
                    };
                    this.stockfish.postMessage("uci");
                    this.stockfish.postMessage("ucinewgame");
                } catch(e) {
                    console.error("Stockfish initialization failed:", e);
                    this.stockfish = null;
                }
            }

            parseUCI(uci) {
                const files = "abcdefgh";
                const fx = files.indexOf(uci[0]);
                const fy = 8 - parseInt(uci[1]);
                const tx = files.indexOf(uci[2]);
                const ty = 8 - parseInt(uci[3]);
                const promotion = uci.length > 4 ? uci[4] : null;
                
                const all = this.getAllValidMoves(this.turn, this.board, this.enPassantTarget);
                const move = all.find(m => m.from.x === fx && m.from.y === fy && m.to.x === tx && m.to.y === ty);
                if (move && promotion) {
                    move.promotion = promotion;
                }
                return move;
            }

            saveSession() {
                if (this.roomId && this.userId) {
                    localStorage.setItem('chessRoomId', this.roomId);
                    localStorage.setItem('chessUserId', this.userId);
                    localStorage.setItem('chessIsHost', this.isHost);
                    localStorage.setItem('chessGameMode', 'online');
                }
            }

            clearSession() {
                localStorage.removeItem('chessRoomId');
                localStorage.removeItem('chessUserId');
                localStorage.removeItem('chessIsHost');
                localStorage.removeItem('chessGameMode');
            }
            
            startHeartbeat() {
                if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
                const sendHeartbeat = async () => {
                    if (this.gameMode === 'online' && this.roomId && this.userId && !this.isGameOver) {
                        try {
                            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', window.game.roomId);
                            await updateDoc(roomRef, {
                                [`lastSeen.${this.userId}`]: Date.now()
                            });
                        } catch (e) {}
                    }
                };
                sendHeartbeat();
                this.heartbeatInterval = setInterval(sendHeartbeat, 5000);
            }

            getFen() {
                let fen = "";
                for (let y = 0; y < 8; y++) {
                    let empty = 0;
                    for (let x = 0; x < 8; x++) {
                        const p = this.board[y][x];
                        if (p) {
                            if (empty > 0) { fen += empty; empty = 0; }
                            fen += p;
                        } else {
                            empty++;
                        }
                    }
                    if (empty > 0) fen += empty;
                    if (y < 7) fen += "/";
                }
                
                fen += this.turn === 'white' ? " w " : " b ";
                
                let castling = "";
                if (!this.movedStatus.whiteKing) {
                    if (!this.movedStatus.whiteRookRight) castling += "K";
                    if (!this.movedStatus.whiteRookLeft) castling += "Q";
                }
                if (!this.movedStatus.blackKing) {
                    if (!this.movedStatus.blackRookRight) castling += "k";
                    if (!this.movedStatus.blackRookLeft) castling += "q";
                }
                if (castling === "") castling = "-";
                fen += castling + " ";
                
                if (this.enPassantTarget) {
                    const file = String.fromCharCode('a'.charCodeAt(0) + this.enPassantTarget.x);
                    const rank = 8 - this.enPassantTarget.y;
                    fen += file + rank + " ";
                } else {
                    fen += "- ";
                }
                
                fen += this.halfMoveClock + " ";
                fen += Math.floor(this.moveCount / 2) + 1;
                
                return fen;
            }

            getPositionString() {
                const ms = this.movedStatus || {};
                const msStr = `${ms.whiteKing ? 1 : 0}${ms.blackKing ? 1 : 0}${ms.whiteRookLeft ? 1 : 0}${ms.whiteRookRight ? 1 : 0}${ms.blackRookLeft ? 1 : 0}${ms.blackRookRight ? 1 : 0}`;
                const epStr = this.enPassantTarget ? `${this.enPassantTarget.x},${this.enPassantTarget.y}` : "null";
                return JSON.stringify(this.board) + "|" + this.turn + "|" + msStr + "|" + epStr;
            }

            getRankedAdvantage() {
                let myScore = 0;
                let cpuScore = 0;
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const p = this.board[y][x];
                        if (!p) continue;
                        const val = DISPLAY_MATERIAL_VALUES[p] || 0;
                        const isMyPiece = (this.playerColor === 'white' ? p === p.toUpperCase() : p === p.toLowerCase());
                        if (isMyPiece) myScore += val;
                        else cpuScore += val;
                    }
                }
                return myScore - cpuScore;
            }

            getRankedEloStep(advantageDelta) {
                if (!advantageDelta) return 0;
                const absDelta = Math.min(4, Math.abs(advantageDelta));
                let minStep = 1;
                let maxStep = 4;
                if (this.moveCount <= 10) {
                    minStep = 3;
                    maxStep = 7;
                } else if (this.moveCount <= 20) {
                    minStep = 2;
                    maxStep = 6;
                } else if (this.moveCount <= 30) {
                    minStep = 1;
                    maxStep = 5;
                } else {
                    minStep = 1;
                    maxStep = 4;
                }
                const ratio = (absDelta - 1) / 3;
                const step = minStep + (maxStep - minStep) * Math.max(0, ratio);
                let result = Math.round(step);
                if (advantageDelta < 0) {
                    result = Math.max(1, Math.round(result * 0.6));
                }
                return result * Math.sign(advantageDelta);
            }

            updateLanguageUI() {
                if (this.initialized) {
                    this.updatePlayerLabels();
                    if (this.isGameOver) {
                        let isStale = false;
                        let isInsuff = false;
                        let isThreefold = false;
                        let isFiftyMove = false;
                        let isTime = false;
                        let isMate = false;
                        
                        if (this.gameMode === 'online' && this.currentRoomData) {
                            isStale = this.currentRoomData.status === 'finished_stalemate';
                            isInsuff = this.currentRoomData.status === 'finished_insufficient';
                            isThreefold = this.currentRoomData.status === 'finished_threefold';
                            isFiftyMove = this.currentRoomData.status === 'finished_fiftymove';
                            isTime = this.currentRoomData.status === 'finished_timeout';
                            isMate = this.currentRoomData.status === 'finished_mate';
                        } else {
                            if (this.timers[this.turn] <= 0 && this.useTimer) isTime = true;
                            else if (this.isMate()) {
                                if (this.inCheckPos) isMate = true;
                                else isStale = true;
                            } else if (this.isInsufficientMaterial()) {
                                isInsuff = true;
                            } else if (this.halfMoveClock >= 100) {
                                isFiftyMove = true;
                            } else {
                                const posStr = this.getPositionString();
                                if (this.positionHistory.filter(p => p === posStr).length >= 3) {
                                    isThreefold = true;
                                }
                            }
                        }

                        if (isStale) {
                            this.showDrawMessage(window.t('stalemate'));
                        } else if (isInsuff) {
                            this.showDrawMessage(window.t('insufficientMaterial'));
                        } else if (isThreefold) {
                            this.showDrawMessage(window.t('threefoldRepetition'));
                        } else if (isFiftyMove) {
                            this.showDrawMessage(window.t('fiftyMoveRule'));
                        } else if (isTime) {
                            const winnerColor = this.gameMode === 'online' && this.currentRoomData ? this.currentRoomData.winner : (this.turn === 'white' ? 'black' : 'white');
                            this.showWinLoseMessage(window.t('timeout'), winnerColor);
                        } else if (isMate) {
                            const winnerColor = this.turn === 'white' ? 'black' : 'white';
                            this.showWinLoseMessage(window.t('checkmate'), winnerColor);
                        }
                    } else {
                        const checkStr = this.inCheckPos ? window.t('checkWarning') : "";
                        // startTimer内の切断表示が優先されるため、ここは通常表示
                        if (this.gameMode === 'online' && this.turn !== this.playerColor && this.currentRoomData && !this.currentRoomData.gameState.ack) {
                            const turnText = this.turn === this.playerColor ? window.t('yourTurn') : window.t('opponentTurn');
                            this.updateStatus(checkStr + turnText + " - " + window.t('waitingOpponentAck'));
                        } else {
                            this.showTurnMessage(checkStr);
                        }
                    }
                    this.updateMoveCountDisplay();
                }
            }

            startCustomTime() {
                const baseSelect = document.getElementById('base-time-select');
                const incSelect = document.getElementById('inc-time-select');
                if (baseSelect && incSelect) {
                    const baseSec = parseInt(baseSelect.value);
                    const incSec = parseInt(incSelect.value);
                    this.startWithTime(baseSec, incSec);
                }
            }

            getNotation(move) {
                if (!move) return "";
                let suffix = "";
                if (move.isCheckmate) suffix = "#";
                else if (move.isCheck) suffix = "+";

                if (move.isCastling) {
                    return (move.to.x === 6 ? "O-O" : "O-O-O") + suffix;
                }
                const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
                const toStr = files[move.to.x] + ranks[move.to.y];
                const isPawn = move.piece && move.piece.toUpperCase() === 'P';
                const p = !isPawn ? (move.piece ? move.piece.toUpperCase() : '') : '';
                const isCapture = !!(move.isCapture || move.isEnPassant);
                const capturePrefix = isPawn && isCapture ? files[move.from.x] : '';
                const sep = isCapture ? 'x' : '';
                const promo = move.promotion ? '=' + move.promotion.toUpperCase() : '';
                return p + capturePrefix + sep + toStr + promo + suffix;
            }

            updateMoveCountDisplay() {
                const el = document.getElementById('move-count-display');
                if (el) {
                    const currentTurn = Math.floor((this.moveCount - 1) / 2) + 1;
                    const displayTurn = Math.max(1, currentTurn);
                    el.innerText = `${window.t('moveCountPrefix')}${this.moveCount} (${window.t('turnWord')}${displayTurn})`;
                }
                const notationEl = document.getElementById('last-move-notation');
                if (notationEl) {
                    if (this.lastMove) {
                        notationEl.innerText = this.getNotation(this.lastMove);
                    } else {
                        notationEl.innerText = "";
                    }
                }
            }

            updatePlayerLabels() {
                const topLabel = document.getElementById('top-player-label');
                const bottomLabel = document.getElementById('bottom-player-label');
                const modeDisplay = document.getElementById('mode-display');

                if (this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') {
                    const baseCpuElo = this.baseAiLevel === 50
                        ? '2500+'
                        : (this.baseAiElo ?? (this.baseAiLevel ? 250 + (this.baseAiLevel - 1) * 45 : this.aiElo || 250));
                    const currentCpuElo = this.baseAiLevel === 50 ? '2500+' : this.aiElo;
                    if (bottomLabel) bottomLabel.innerText = `${window.t('you')}${this.playerColor === 'white' ? window.t('colorWhiteSuffix') : window.t('colorBlackSuffix')}`;
                    if (topLabel) topLabel.innerText = `${window.t('cpuName')} (${window.t('cpuEloLabel')}: ${currentCpuElo})${this.playerColor === 'white' ? window.t('colorBlackPvp') : window.t('colorWhitePvp')}`;
                    if (modeDisplay) modeDisplay.innerText = this.gameMode === 'cpu_ranked' ? `${window.t('rankedMatch')} (Rate: ${this.playerProfile?.elo || 250})` : `${window.t('vsCpu')} ELO ${baseCpuElo}`;
                } else if (this.gameMode === 'pvp') {
                    if (bottomLabel) bottomLabel.innerText = `${window.t('p1White')}`;
                    if (topLabel) topLabel.innerText = `${window.t('p2Black')}`;
                    if (modeDisplay) modeDisplay.innerText = window.t('offlinePvp');
                } else if (this.gameMode === 'online') {
                    const formatIdentity = (value, fallbackName) => {
                        const raw = value || '';
                        if (!raw) return { name: fallbackName, suffix: '' };
                        const parts = raw.split('-');
                        return {
                            name: parts[0] || fallbackName,
                            suffix: parts.slice(1).join('-')
                        };
                    };

                    const myIdentity = this.getProfileIdentity();
                    let opponentName = window.t('anonymous');
                    let opponentIdentity = { name: opponentName, suffix: '' };
                    let myElo = this.playerProfile?.elo || 250;
                    let opponentElo = "---";

                    if (this.currentRoomData) {
                        if (this.currentRoomData.host === this.userId) {
                            opponentName = this.currentRoomData.guestName || window.t('anonymous');
                            opponentIdentity = formatIdentity(opponentName, window.t('anonymous'));
                            opponentElo = this.currentRoomData.guestElo || "---";
                        } else {
                            opponentName = this.currentRoomData.hostName || window.t('anonymous');
                            opponentIdentity = formatIdentity(opponentName, window.t('anonymous'));
                            opponentElo = this.currentRoomData.hostElo || "---";
                        }
                    }
                    if (bottomLabel) bottomLabel.innerText = `${myIdentity.displayName}${myIdentity.suffix ? ` (ID: ${myIdentity.suffix})` : ''} (ELO ${myElo})${this.playerColor === 'white' ? window.t('colorWhiteSuffix') : window.t('colorBlackSuffix')}`;
                    if (topLabel) topLabel.innerText = `${opponentIdentity.name}${opponentIdentity.suffix ? ` (ID: ${opponentIdentity.suffix})` : ''} (ELO ${opponentElo})${this.playerColor === 'white' ? window.t('colorBlackPvp') : window.t('colorWhitePvp')}`;
                    if (modeDisplay) modeDisplay.innerText = `${window.t('onlinePvp')} [${this.roomId}]`;
                }
            }
            
            toggleAutoRotate(checked) {
                this.sfx.buttonClick();
                this.autoRotate = checked;
                this.updateRotationUI();
                this.needsRender = true;
            }

            updateRotationUI() {
                const shouldRotate = (this.gameMode === 'pvp' && this.autoRotate && this.turn === 'black');
                const textIds = [
                    'mode-display', 'top-player-label', 'timer-top', 'game-status', 
                    'move-count-display', 'last-move-notation', 'bottom-player-label', 'timer-bottom', 
                    'undo-btn', 'rematch-btn', 'exit-btn', 'assist-text', 'auto-rotate-text'
                ];

                textIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        if (shouldRotate) {
                            el.classList.add('rotate-180');
                        } else {
                            el.classList.remove('rotate-180');
                        }
                    }
                });
            }

            setupListeners() {
                const promotionPieces = document.querySelectorAll('#promotion-modal [onclick*="selectPromotion"]');
                promotionPieces.forEach((el, index) => {
                    if (el && !el.hasAttribute('tabindex')) {
                        el.setAttribute('tabindex', '0');
                    }
                    if (el && !el.dataset.keyboardIndex) {
                        el.dataset.keyboardIndex = String(index);
                    }
                });

                const getPointerPos = (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                    
                    const scaleX = this.canvas.width / rect.width;
                    const scaleY = this.canvas.height / rect.height;
                    
                    let rawX = (clientX - rect.left) * scaleX;
                    let rawY = (clientY - rect.top) * scaleY;
                    
                    return { x: rawX, y: rawY, width: this.canvas.width };
                };

                const onDown = (e) => {
                    if (e.type === 'touchstart') e.preventDefault();
                    const pos = getPointerPos(e);
                    this.handlePointerDown(pos.x, pos.y, pos.width);
                };

                const onMove = (e) => {
                    if (!this.draggingPiece) return;
                    if (e.type === 'touchmove') e.preventDefault();
                    const pos = getPointerPos(e);
                    this.handlePointerMove(pos.x, pos.y);
                };

                const onUp = (e) => {
                    if (!this.draggingPiece) return;
                    if (e.type === 'touchend') e.preventDefault();
                    let clientX = e.clientX;
                    let clientY = e.clientY;
                    if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0) {
                        clientX = e.changedTouches[0].clientX;
                        clientY = e.changedTouches[0].clientY;
                    }
                    const rect = this.canvas.getBoundingClientRect();
                    const scaleX = this.canvas.width / rect.width;
                    const scaleY = this.canvas.height / rect.height;
                    const rawX = (clientX - rect.left) * scaleX;
                    const rawY = (clientY - rect.top) * scaleY;
                    this.handlePointerUp(rawX, rawY, this.canvas.width);
                };

                this.canvas.addEventListener('mousedown', onDown);
                this.canvas.addEventListener('touchstart', onDown, { passive: false });
                
                window.addEventListener('mousemove', onMove);
                window.addEventListener('touchmove', onMove, { passive: false });
                
                window.addEventListener('mouseup', onUp);
                window.addEventListener('touchend', onUp, { passive: false });

                window.addEventListener('keydown', (e) => this.handleKeyboardInput(e), true);
            }

            isTextEntryElement(element) {
                if (!element) return false;
                const tag = element.tagName;
                const type = (element.getAttribute && element.getAttribute('type')) ? element.getAttribute('type').toLowerCase() : '';
                return tag === 'INPUT' || tag === 'TEXTAREA' || element.isContentEditable || tag === 'SELECT' || type === 'range';
            }

            isEditableTextField(element) {
                if (!element || element.tagName !== 'INPUT') return false;
                const type = (element.getAttribute('type') || '').toLowerCase();
                return type === '' || type === 'text' || type === 'search' || type === 'email' || type === 'password' || type === 'url' || type === 'tel';
            }

            beginKeyboardEdit(element) {
                if (!element) return;
                this.keyboardEditElement = element;
                if (typeof element.focus === 'function') {
                    element.focus();
                }
                if (this.isEditableTextField(element) && typeof element.select === 'function') {
                    element.select();
                }
            }

            endKeyboardEdit(blur = false) {
                const element = this.keyboardEditElement;
                this.keyboardEditElement = null;
                if (blur && element && typeof element.blur === 'function') {
                    element.blur();
                }
            }

            isOverlayVisible(id) {
                const el = document.getElementById(id);
                return !!el && el.style.display !== 'none';
            }

            getVisibleOverlayId() {
                const overlays = ['confirm-modal', 'promotion-modal', 'email-link-registration-modal', 'auth-modal', 'identity-modal', 'settings-modal', 'waiting-room', 'time-selection', 'online-config', 'cpu-config', 'mode-selection'];
                return overlays.find(id => this.isOverlayVisible(id)) || null;
            }

            getFocusableElements(container) {
                if (!container) return [];
                return Array.from(container.querySelectorAll('button, select, input, [tabindex]:not([tabindex="-1"])'))
                    .filter(el => !el.disabled && el.offsetParent !== null);
            }

            setGameUiInteractivity(mode = 'all', allowedIds = []) {
                const container = document.getElementById('game-ui-container');
                if (!container) return;

                const disableAll = mode === 'none';

                if ('inert' in container) {
                    container.inert = disableAll;
                }
                container.setAttribute('aria-hidden', disableAll ? 'true' : 'false');

                const focusables = Array.from(container.querySelectorAll('button, select, input, textarea, [href], [tabindex]'));
                focusables.forEach((el) => {
                    const isAllowed = mode === 'all' || allowedIds.includes(el.id);
                    if (!disableAll && isAllowed) {
                        if (el.dataset.prevTabindex !== undefined) {
                            if (el.dataset.prevTabindex === '') {
                                el.removeAttribute('tabindex');
                            } else {
                                el.setAttribute('tabindex', el.dataset.prevTabindex);
                            }
                            delete el.dataset.prevTabindex;
                        } else if (el.getAttribute('tabindex') === '-1') {
                            el.removeAttribute('tabindex');
                        }
                    } else if (!el.dataset.prevTabindex) {
                        el.dataset.prevTabindex = el.getAttribute('tabindex') ?? '';
                        el.setAttribute('tabindex', '-1');
                    }
                });
            }

            updateGameUiInteractivity() {
                const overlayId = this.getVisibleOverlayId();
                if (!this.initialized || overlayId) {
                    this.setGameUiInteractivity('none');
                    return;
                }
                if (this.isGameOver) {
                    const allowedIds = this.getGameOverButtons().map(button => button.id);
                    this.setGameUiInteractivity('gameover', allowedIds);
                    return;
                }
                this.setGameUiInteractivity('all');
            }

            focusNextOverlayElement(direction = 1) {
                const overlayId = this.getVisibleOverlayId();
                if (!overlayId) return false;
                const overlay = document.getElementById(overlayId);
                const focusables = this.getFocusableElements(overlay);
                if (focusables.length === 0) return false;

                const currentIndex = focusables.indexOf(document.activeElement);
                const nextIndex = currentIndex >= 0 ? (currentIndex + direction + focusables.length) % focusables.length : (direction > 0 ? 0 : focusables.length - 1);
                this.keyboardEditElement = null;
                focusables[nextIndex].focus();
                return true;
            }

            focusFirstOverlayElement(overlayId) {
                const overlay = document.getElementById(overlayId);
                if (!overlay) return false;
                const focusables = this.getFocusableElements(overlay);
                if (focusables.length === 0) return false;
                this.keyboardEditElement = null;
                focusables[0].focus();
                return true;
            }

            getGameOverButtons() {
                return ['undo-btn', 'rematch-btn', 'exit-btn']
                    .map(id => document.getElementById(id))
                    .filter(el => el && el.style.display !== 'none' && !el.disabled);
            }

            focusGameOverButton(direction = 0) {
                const buttons = this.getGameOverButtons();
                if (buttons.length === 0) return false;

                const currentIndex = buttons.indexOf(document.activeElement);
                const nextIndex = currentIndex >= 0
                    ? (currentIndex + direction + buttons.length) % buttons.length
                    : (direction > 0 ? 0 : buttons.length - 1);

                buttons[nextIndex].focus();
                return true;
            }

            activateFocusedGameOverButton() {
                const active = document.activeElement;
                const buttons = this.getGameOverButtons();
                if (active && buttons.includes(active) && typeof active.click === 'function') {
                    active.click();
                    return true;
                }

                if (buttons.length > 0 && typeof buttons[0].click === 'function') {
                    buttons[0].click();
                    return true;
                }
                return false;
            }

            activateFocusedElement() {
                const active = document.activeElement;
                if (!active) return false;
                if (typeof active.click === 'function') {
                    active.click();
                    return true;
                }
                return false;
            }

            handleKeyboardInput(e) {
                const overlayId = this.getVisibleOverlayId();
                const key = e.key;
                const activeElement = document.activeElement;
                const eventTarget = e.target;
                const eventSource = (typeof e.composedPath === 'function' && e.composedPath().length > 0) ? e.composedPath()[0] : eventTarget;
                const activeTag = activeElement?.tagName;
                const activeType = (activeElement?.getAttribute && activeElement.getAttribute('type')) ? activeElement.getAttribute('type').toLowerCase() : '';
                const targetTag = eventTarget?.tagName;
                const targetType = (eventTarget?.getAttribute && eventTarget.getAttribute('type')) ? eventTarget.getAttribute('type').toLowerCase() : '';
                const sourceTag = eventSource?.tagName;
                const sourceType = (eventSource?.getAttribute && eventSource.getAttribute('type')) ? eventSource.getAttribute('type').toLowerCase() : '';
                const editingElement = (
                    this.isEditableTextField(activeElement) ||
                    this.isEditableTextField(eventTarget) ||
                    this.isEditableTextField(eventSource) ||
                    targetTag === 'TEXTAREA' ||
                    sourceTag === 'TEXTAREA' ||
                    activeElement?.isContentEditable ||
                    eventTarget?.isContentEditable ||
                    eventSource?.isContentEditable
                );
                const isArrowKey = key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight';

                if (this.keyboardEditElement && document.activeElement === this.keyboardEditElement) {
                    if (key === 'Escape') {
                        e.preventDefault();
                        this.endKeyboardEdit(true);
                    } else if (key === 'Enter') {
                        e.preventDefault();
                        this.endKeyboardEdit(false);
                    }
                    return;
                }

                if (editingElement && isArrowKey) {
                    return;
                }

                if (overlayId === 'time-selection' && activeTag === 'SELECT' && isArrowKey) {
                    e.preventDefault();
                    this.focusNextOverlayElement((key === 'ArrowUp' || key === 'ArrowLeft') ? -1 : 1);
                    return;
                }

                if (overlayId && activeType === 'range' && (key === 'ArrowLeft' || key === 'ArrowRight')) {
                    return;
                }

                if (e.repeat && isArrowKey) {
                    return;
                }

                const isModKey = e.ctrlKey || e.metaKey;
                if (isModKey && key.toLowerCase() === 'z') {
                    e.preventDefault();
                    this.confirmUndo();
                    return;
                }
                if (isModKey && e.shiftKey && key.toLowerCase() === 'a') {
                    e.preventDefault();
                    if (document.getElementById('assist-mode-container')?.style.display !== 'none') {
                        this.toggleAssistMode(!this.isAssistMode);
                    }
                    return;
                }

                if (overlayId === 'confirm-modal') {
                    const yesBtn = document.getElementById('confirm-yes');
                    const noBtn = document.getElementById('confirm-no');
                    const canToggle = yesBtn && noBtn && noBtn.style.display !== 'none';

                    if (key === 'Escape') {
                        e.preventDefault();
                        this.hideConfirm();
                        return;
                    }
                    if (canToggle && isArrowKey) {
                        e.preventDefault();
                        const target = document.activeElement === yesBtn ? noBtn : yesBtn;
                        target?.focus();
                        return;
                    }
                    if (key === 'Enter' || key === ' ') {
                        e.preventDefault();
                        if (document.activeElement === noBtn && canToggle) {
                            noBtn.click();
                        } else {
                            yesBtn?.click();
                        }
                        return;
                    }
                    return;
                }

                if (overlayId === 'email-link-registration-modal') {
                    if (key === 'Escape') {
                        e.preventDefault();
                        return;
                    }
                    if (key === 'ArrowDown' || key === 'ArrowRight') {
                        e.preventDefault();
                        this.focusNextOverlayElement(1);
                        return;
                    }
                    if (key === 'ArrowUp' || key === 'ArrowLeft') {
                        e.preventDefault();
                        this.focusNextOverlayElement(-1);
                        return;
                    }
                    if (key === 'Enter' || key === ' ') {
                        e.preventDefault();
                        this.activateFocusedElement();
                        return;
                    }
                    return;
                }

                if (overlayId === 'auth-modal') {
                    if (key === 'Escape') {
                        e.preventDefault();
                        const modal = document.getElementById('auth-modal');
                        if (modal) modal.style.display = 'none';
                        return;
                    }
                    if (key === 'ArrowDown' || key === 'ArrowRight') {
                        e.preventDefault();
                        this.focusNextOverlayElement(1);
                        return;
                    }
                    if (key === 'ArrowUp' || key === 'ArrowLeft') {
                        e.preventDefault();
                        this.focusNextOverlayElement(-1);
                        return;
                    }
                    if (key === 'Enter' || key === ' ') {
                        e.preventDefault();
                        this.activateFocusedElement();
                        return;
                    }
                    return;
                }

                if (overlayId === 'promotion-modal') {
                    const choices = Array.from(document.querySelectorAll('#promotion-modal [onclick*="selectPromotion"]'));
                    if (choices.length) {
                        const focusedIndex = Math.max(0, choices.indexOf(document.activeElement));
                        const moveFocus = (step) => {
                            const next = choices[(focusedIndex + step + choices.length) % choices.length];
                            if (next) next.focus();
                        };
                        if (key === 'ArrowRight' || key === 'ArrowDown') {
                            e.preventDefault();
                            moveFocus(1);
                            return;
                        }
                        if (key === 'ArrowLeft' || key === 'ArrowUp') {
                            e.preventDefault();
                            moveFocus(-1);
                            return;
                        }
                        if (key === 'Escape') {
                            e.preventDefault();
                            choices[0]?.click();
                            return;
                        }
                        if (key === 'Enter' || key === ' ') {
                            e.preventDefault();
                            if (document.activeElement && choices.includes(document.activeElement)) {
                                document.activeElement.click();
                            } else {
                                choices[0]?.click();
                            }
                            return;
                        }
                    }
                    return;
                }

                if (overlayId) {
                    if (key === 'Escape') {
                        e.preventDefault();
                        if (overlayId === 'identity-modal') this.closeIdentityModal();
                        else if (overlayId === 'settings-modal') this.closeSettingsModal();
                        else if (overlayId === 'waiting-room') this.cancelOnlineRoom();
                        else if (overlayId !== 'mode-selection') this.showModeSelection();
                        return;
                    }
                    if (key === 'ArrowDown' || key === 'ArrowRight') {
                        e.preventDefault();
                        this.focusNextOverlayElement(1);
                        return;
                    }
                    if (key === 'ArrowUp' || key === 'ArrowLeft') {
                        e.preventDefault();
                        this.focusNextOverlayElement(-1);
                        return;
                    }
                    if (key === 'Enter' || key === ' ') {
                        if (activeTag === 'SELECT' && overlayId === 'time-selection') {
                            e.preventDefault();
                            if (typeof activeElement.showPicker === 'function') {
                                activeElement.showPicker();
                            } else {
                                activeElement.click();
                            }
                            return;
                        }
                        if (activeType === 'range' && overlayId === 'time-selection') {
                            e.preventDefault();
                            this.focusNextOverlayElement(1);
                            return;
                        }
                        e.preventDefault();
                        if (key === 'Enter' && this.isEditableTextField(activeElement)) {
                            this.beginKeyboardEdit(activeElement);
                        } else {
                            this.activateFocusedElement();
                        }
                        return;
                    }
                    return;
                }

                if (this.isGameOver) {
                    const gameOverButtons = this.getGameOverButtons();
                    if (gameOverButtons.length > 0 && (key === 'ArrowDown' || key === 'ArrowRight')) {
                        e.preventDefault();
                        this.focusGameOverButton(1);
                        return;
                    }
                    if (gameOverButtons.length > 0 && (key === 'ArrowUp' || key === 'ArrowLeft')) {
                        e.preventDefault();
                        this.focusGameOverButton(-1);
                        return;
                    }
                    if (key === 'Enter' || key === ' ') {
                        e.preventDefault();
                        this.activateFocusedGameOverButton();
                        return;
                    }
                    return;
                }

                if (!this.initialized || this.animatingPiece) {
                    return;
                }

                const boardKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Escape'];
                if (!boardKeys.includes(key)) {
                    return;
                }

                if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked' || this.gameMode === 'online') && this.turn !== this.playerColor) {
                    return;
                }

                if (key === 'Escape') {
                    e.preventDefault();
                    if (this.selected) {
                        this.selected = null;
                        this.validMoves = [];
                        this.needsRender = true;
                    } else {
                        this.confirmExit();
                    }
                    return;
                }

                if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
                    e.preventDefault();
                    this.moveBoardCursor(key);
                    return;
                }

                if (key === 'Enter' || key === ' ') {
                    e.preventDefault();
                    this.activateBoardCursor();
                }
            }

            moveBoardCursor(key) {
                if (!this.boardCursor) {
                this.boardCursor = { x: 3, y: 6 };
                }

                const reversed = this.playerColor === 'black';
                const deltaMap = reversed ? {
                    ArrowUp: { x: 0, y: 1 },
                    ArrowDown: { x: 0, y: -1 },
                    ArrowLeft: { x: 1, y: 0 },
                    ArrowRight: { x: -1, y: 0 }
                } : {
                    ArrowUp: { x: 0, y: -1 },
                    ArrowDown: { x: 0, y: 1 },
                    ArrowLeft: { x: -1, y: 0 },
                    ArrowRight: { x: 1, y: 0 }
                };

                const delta = deltaMap[key];
                if (!delta) return;

                const nextX = Math.max(0, Math.min(7, this.boardCursor.x + delta.x));
                const nextY = Math.max(0, Math.min(7, this.boardCursor.y + delta.y));
                this.boardCursor = { x: nextX, y: nextY };
                this.needsRender = true;
            }

            activateBoardCursor() {
                if (!this.boardCursor) return;
                const { x, y } = this.boardCursor;
                const piece = this.board[y]?.[x];

                if (this.selected) {
                    const move = this.validMoves?.find(m => m.to.x === x && m.to.y === y);
                    if (move) {
                        this.startMove(move);
                        return;
                    }
                }

                if (piece && (this.turn === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
                    this.selected = { x, y };
                    this.validMoves = this.getMoves(x, y, this.board);
                    this.boardCursor = { x, y };
                    this.sfx.pieceSelect();
                    this.needsRender = true;
                    return;
                }

                this.selected = null;
                this.validMoves = [];
                this.needsRender = true;
            }

            handlePointerDown(rawX, rawY, width) {
                if (!this.initialized || this.isGameOver || this.animatingPiece) return;
                if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked' || this.gameMode === 'online') && this.turn !== this.playerColor) return;
                
                const sx = Math.floor(rawX / (width / 8)), sy = Math.floor(rawY / (width / 8));
                if (sx < 0 || sx > 7 || sy < 0 || sy > 7) return;
                const { x, y } = this.playerColor === 'black' ? { x: 7 - sx, y: 7 - sy } : { x: sx, y: sy };

                const p = this.board[y][x];

                if (this.selected) {
                    const move = this.validMoves.find(m => m.to.x === x && m.to.y === y);
                    if (move) { 
                        this.startMove(move); 
                        this.draggingPiece = null;
                        return; 
                    }
                }

                if (p && (this.turn === 'white' ? p === p.toUpperCase() : p === p.toLowerCase())) {
                    this.selected = { x, y };
                    this.validMoves = this.getMoves(x, y, this.board);
                    this.sfx.pieceSelect(); 
                    this.boardCursor = { x, y };
                    
                    this.draggingPiece = {
                        piece: p,
                        fromX: x,
                        fromY: y,
                        currentX: rawX,
                        currentY: rawY
                    };
                } else { 
                    this.selected = null; 
                    this.draggingPiece = null;
                }
                this.needsRender = true;
            }

            handlePointerMove(rawX, rawY) {
                if (!this.draggingPiece) return;
                this.draggingPiece.currentX = rawX;
                this.draggingPiece.currentY = rawY;
                this.needsRender = true;
            }

            handlePointerUp(rawX, rawY, width) {
                if (!this.draggingPiece) return;

                const sx = Math.floor(rawX / (width / 8)), sy = Math.floor(rawY / (width / 8));
                
                const pieceX = this.draggingPiece.fromX;
                const pieceY = this.draggingPiece.fromY;
                this.draggingPiece = null; 
                
                if (sx >= 0 && sx <= 7 && sy >= 0 && sy <= 7) {
                    const { x, y } = this.playerColor === 'black' ? { x: 7 - sx, y: 7 - sy } : { x: sx, y: sy };
                    
                    const move = this.validMoves.find(m => m.to.x === x && m.to.y === y);
                    if (move) {
                        this.startMove(move);
                    }
                }
                
                this.boardCursor = { x: pieceX, y: pieceY };
                this.needsRender = true;
            }

            showModeSelection() {
                this.sfx.buttonClick();
                this.stopTimer();
                if (this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') {
                    this.clearPersistentGameState();
                }
                if (this.unsubRoom) {
                    this.unsubRoom();
                    this.unsubRoom = null;
                }
                if (this.heartbeatInterval) {
                    clearInterval(this.heartbeatInterval);
                    this.heartbeatInterval = null;
                }
                this.hideAllOverlays();
                document.getElementById('mode-selection').style.display = 'flex';
                document.getElementById('timer-top').style.display = 'none';
                document.getElementById('timer-bottom').style.display = 'none';
                document.getElementById('meter-ui').style.display = 'none';
                document.getElementById('rematch-btn').style.display = 'none';
                document.getElementById('auto-rotate-container').style.display = 'none';
                
                this.autoRotate = false;
                const rotateToggle = document.getElementById('auto-rotate-toggle');
                if (rotateToggle) rotateToggle.checked = false;
                this.updateRotationUI();
                
                this.clearSession();
                this.initialized = false;
                this.isGameOver = false;
                this.gameMode = null;
                this.roomId = null;
                this.moveCount = 0;
                this.currentRoomData = null;
                this.clearActiveStyles();
                document.getElementById('game-status').innerText = window.t('statusReady');
                this.updateGameUiInteractivity();
                this.updateProfileUI(); // モード選択画面に戻るたびにプロフィールUIを更新
                setTimeout(() => this.focusFirstOverlayElement('mode-selection'), 0);
            }

            showCpuConfig() {
                this.sfx.buttonClick();
                this.hideAllOverlays();
                document.getElementById('cpu-config').style.display = 'flex';
                this.updateGameUiInteractivity();
                setTimeout(() => this.focusFirstOverlayElement('cpu-config'), 0);
            }

            showOnlineConfig() {
                this.sfx.buttonClick();
                if (!this.isLoggedIn) {
                    return this.showConfirm(window.t('error'), window.t('loginRequiredInfo'), ()=>{}, true);
                }
                if (!auth || !db) {
                    return this.showConfirm(window.t('error'), window.t('firebaseErrorMsg'), ()=>{}, true);
                }
                this.hideAllOverlays();
                this.updateProfileUI();
                document.getElementById('online-config').style.display = 'flex';
                this.updateGameUiInteractivity();
                setTimeout(() => this.focusFirstOverlayElement('online-config'), 0);
            }

            generateRandomDisplayName() {
                const namePools = {
                    ja: ['Sakura', 'Yuki', 'Haru', 'Mikan', 'Kumo', 'Aoi', 'Rin', 'Kai', 'Momo', 'Nagi'],
                    en: ['Nova', 'Orion', 'Milo', 'Echo', 'Luna', 'Pixel', 'Neo', 'Aria', 'Zephyr', 'Ridge'],
                    zh: ['Ming', 'Ling', 'Lan', 'Jin', 'Yue', 'Lei', 'Shan', 'Qing', 'Xiao', 'Chen']
                };
                const pool = namePools[window.currentLang] || namePools.en;
                return pool[Math.floor(Math.random() * pool.length)];
            }

            showOnlineTimeSelection() {
                this.sfx.buttonClick();
                this.roomId = document.getElementById('room-id-input').value.trim();
                // ログイン済みならプロフィールの username を使用
                if (this.isLoggedIn && this.playerProfile) {
                    this.playerName = this.getProfileIdentity().full;
                } else {
                    this.playerName = 'Player';
                }
                if (!this.roomId) {
                    this.showConfirm(window.t('error'), window.t('inputRoomWordMsg'), ()=>{}, true);
                    return;
                }
                this.hideAllOverlays();
                this.tempMode = 'online';
                document.getElementById('online-turn-config').style.display = 'flex';
                document.getElementById('time-selection').style.display = 'flex';
                this.updateGameUiInteractivity();
                setTimeout(() => this.focusFirstOverlayElement('time-selection'), 0);
            }

            showTimeSelection(mode, level = 250) {
                this.sfx.buttonClick();
                this.tempMode = mode;
                this.tempLevel = parseInt(level);
                this.hideAllOverlays();
                
                if (mode === 'online') {
                    document.getElementById('online-turn-config').style.display = 'flex';
                } else {
                    document.getElementById('online-turn-config').style.display = 'none';
                }
                
                document.getElementById('time-selection').style.display = 'flex';
                this.updateGameUiInteractivity();
                setTimeout(() => this.focusFirstOverlayElement('time-selection'), 0);
            }

            hideAllOverlays() {
                const ids = ['mode-selection', 'cpu-config', 'online-config', 'waiting-room', 'time-selection', 'promotion-modal', 'email-link-registration-modal', 'auth-modal', 'identity-modal', 'settings-modal', 'confirm-modal'];
                ids.forEach(id => document.getElementById(id).style.display = 'none');
                this.updateGameUiInteractivity();
            }

            confirmUndo() {
                this.sfx.buttonClick();
                if (this.gameMode === 'online' || this.gameMode === 'cpu_ranked') {
                    return this.showConfirm(window.t('error'), window.t('noUndoOnlineMsg'), ()=>{}, true);
                }
                if (this.gameMode === 'cpu' && this.playerColor === 'black' && this.history.length <= 1) {
                    return; 
                }
                if (this.history.length === 0 || this.animatingPiece) return;
                this.showConfirm(window.t('undoMove'), window.t('confirmUndoMsg'), () => {
                    this.undoMove();
                });
            }

            confirmExit() {
                this.sfx.buttonClick();
                const isRankedMatch = this.gameMode === 'cpu_ranked';
                const exitTitle = isRankedMatch ? window.t('rankedExitTitle') : window.t('exit');
                const exitMessage = isRankedMatch ? window.t('rankedExitMsg') : window.t('confirmExitMsg');
                this.showConfirm(exitTitle, exitMessage, async () => {
                    if (this.gameMode === 'online' && this.roomId && this.userId) {
                        try {
                            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                            await updateDoc(roomRef, {
                                status: 'abandoned',
                                whoAbandoned: this.userId
                            });
                            if (this.isHost) {
                                setTimeout(() => deleteDoc(roomRef).catch(()=>{}), 2000);
                            }
                        } catch(e) { console.error(e); }
                    }
                    this.showModeSelection();
                });
            }

            showConfirm(title, message, callback, isAlert = false) {
                const modal = document.getElementById('confirm-modal');
                if (!modal) return;
                document.getElementById('confirm-title').innerText = title;
                document.getElementById('confirm-message').innerText = message;
                
                const activeOverlays = [];
                const ids = ['mode-selection', 'cpu-config', 'online-config', 'waiting-room', 'time-selection', 'promotion-modal', 'email-link-registration-modal', 'auth-modal', 'identity-modal', 'settings-modal'];
                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el && el.style.display === 'flex') {
                        activeOverlays.push(id);
                        el.style.display = 'none';
                    }
                });

                const yesBtn = document.getElementById('confirm-yes');
                const noBtn = document.getElementById('confirm-no');
                if (!yesBtn || !noBtn) return;

                modal.style.display = 'flex';
                this.confirmCallback = callback;
                this.confirmActiveOverlays = activeOverlays;
                this.updateGameUiInteractivity();

                if (isAlert) {
                    yesBtn.innerText = window.t('confirmTitle');
                    yesBtn.classList.remove('flex-1');
                    yesBtn.classList.add('w-full');
                    noBtn.style.display = 'none';
                } else {
                    yesBtn.innerText = window.t('yes');
                    yesBtn.classList.add('flex-1');
                    yesBtn.classList.remove('w-full');
                    noBtn.style.display = 'block';
                    noBtn.innerText = window.t('no');
                }
                setTimeout(() => yesBtn?.focus(), 0);
            }

            hideConfirm() {
                const modal = document.getElementById('confirm-modal');
                if (!modal) return;
                modal.style.display = 'none';
                this.confirmActiveOverlays.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'flex';
                });
                this.confirmActiveOverlays = [];
                this.confirmCallback = null;
                this.updateGameUiInteractivity();
            }

            setupConfirmHandlers() {
                const yesBtn = document.getElementById('confirm-yes');
                const noBtn = document.getElementById('confirm-no');
                if (!yesBtn || !noBtn) return;

                yesBtn.addEventListener('click', () => {
                    this.sfx.buttonClick();
                    const callback = this.confirmCallback;
                    this.hideConfirm();
                    if (callback) callback();
                });

                noBtn.addEventListener('click', () => {
                    this.sfx.buttonClick();
                    this.hideConfirm();
                });
            }

            async joinOnlineRoom() {
                this.sfx.buttonClick();
                this.roomId = document.getElementById('room-id-input').value.trim();
                // ログイン済みならプロフィールの username を使用
                if (this.isLoggedIn && this.playerProfile) {
                    this.playerName = this.getProfileIdentity().full;
                } else {
                    this.playerName = 'Player';
                }
                
                if (!this.roomId) return this.showConfirm(window.t('error'), window.t('inputRoomWordMsg'), ()=>{}, true);
                if (!this.userId) return this.showConfirm(window.t('authStatusPreparing'), window.t('connectingMsg'), ()=>{}, true);

                const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                try {
                    const snap = await getDoc(roomRef);
                    if (!snap.exists()) {
                        return this.showConfirm(window.t('error'), window.t('roomNotFoundMsg'), ()=>{}, true);
                    }
                    const data = snap.data();
                    
                    if (data.status !== 'waiting') {
                        return this.showConfirm(
                            window.t('cannotJoinTitle'), 
                            window.t('cannotJoinMsg'), 
                            ()=>{}, true
                        );
                    }

                    if (data.host === this.userId) {
                        this.userId = this.userId + "_guest";
                    }

                    this.isHost = false;

                    const isHostWhite = data.turnMode === 'fixed' ? true : Math.random() < 0.5;
                    await updateDoc(roomRef, {
                        status: 'playing',
                        guest: this.userId,
                        guestName: this.playerName,
                        guestElo: this.playerProfile?.elo || 250,
                        white: isHostWhite ? data.host : this.userId,
                        black: isHostWhite ? this.userId : data.host,
                        [`lastSeen.${this.userId}`]: Date.now(),
                        [`lastSeen.${data.host}`]: Date.now()
                    });
                    
                    this.saveSession();
                    this.startHeartbeat();
                    this.listenToRoom();
                } catch (e) {
                    console.error(e);
                    this.showConfirm(window.t('commError'), `${window.t('error')}\n${e.message}`, ()=>{}, true);
                }
            }

            async createOnlineRoom(seconds, inc, turnMode) {
                if (!this.userId) return this.showConfirm(window.t('authStatusPreparing'), window.t('connectingMsg'), ()=>{}, true);
                
                this.hideAllOverlays();
                document.getElementById('waiting-room').style.display = 'flex';
                document.getElementById('display-room-id').innerText = this.roomId;
                
                this.isHost = true;
                this.moveCount = 0;

                const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                const initialBoard = [
                    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                    Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
                    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
                ];

                try {
                    await setDoc(roomRef, {
                        status: 'waiting',
                        host: this.userId,
                        hostName: this.playerName,
                        hostElo: this.playerProfile?.elo || 250,
                        guest: null,
                        guestName: null,
                        guestElo: null,
                        timeConfig: { seconds, inc },
                        turnMode: turnMode,
                        lastSeen: {
                            [this.userId]: Date.now()
                        },
                        gameState: {
                            board: JSON.stringify(initialBoard),
                            turn: 'white',
                            timers: { white: seconds, black: seconds },
                            movedStatus: {
                                whiteKing: false, blackKing: false,
                                whiteRookLeft: false, whiteRookRight: false,
                                blackRookLeft: false, blackRookRight: false
                            },
                            enPassantTarget: null,
                            lastMove: null,
                            moveCount: 0,
                            halfMoveClock: 0,
                            positionHistory: [],
                            ack: true,
                            lastMoveTimestamp: Date.now()
                        }
                    });
                    this.saveSession();
                    this.startHeartbeat();
                    this.listenToRoom();
                } catch(e) {
                    console.error(e);
                    this.showConfirm(window.t('commError'), `${window.t('createRoomFailedMsg')}${e.message}`, ()=>{}, true);
                    this.showModeSelection();
                }
            }
            
            async requestRematch() {
                this.sfx.buttonClick();
                document.getElementById('rematch-btn').style.display = 'none';
                
                if (this.gameMode === 'online') {
                    if (!this.isHost || !this.roomId) return;
                    this.updateStatus(window.t('rematchPrep'));

                    try {
                        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                        const snap = await getDoc(roomRef);
                        if (!snap.exists()) return;
                        const data = snap.data();
                        
                        const isHostWhite = data.turnMode === 'fixed' ? true : Math.random() < 0.5;
                        
                        const initialBoard = [
                            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                            Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
                            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
                        ];
                        
                        await updateDoc(roomRef, {
                            status: 'playing',
                            white: isHostWhite ? data.host : data.guest,
                            black: isHostWhite ? data.guest : data.host,
                            [`lastSeen.${this.userId}`]: Date.now(),
                            gameState: {
                                board: JSON.stringify(initialBoard),
                                turn: 'white',
                                timers: { white: data.timeConfig.seconds, black: data.timeConfig.seconds },
                                movedStatus: {
                                    whiteKing: false, blackKing: false,
                                    whiteRookLeft: false, whiteRookRight: false,
                                    blackRookLeft: false, blackRookRight: false
                                },
                                enPassantTarget: null,
                                lastMove: null,
                                moveCount: 0,
                                halfMoveClock: 0,
                                positionHistory: [],
                                ack: true,
                                lastMoveTimestamp: Date.now()
                            }
                        });
                    } catch(e) {
                        console.error("Rematch error:", e);
                        this.updateStatus(window.t('rematchFailed'));
                    }
                } else if (this.gameMode === 'cpu_ranked') {
                    // ランクマッチの再戦はレートを元にレベルを再計算して新規スタート
                    this.startRankedCpu();
                } else {
                    if (this.gameMode === 'cpu') {
                        this.playerColor = Math.random() < 0.5 ? 'white' : 'black';
                    }
                    this.updatePlayerLabels();

                    const initialWhite = this.initialTimeSec !== undefined ? this.initialTimeSec : 600;
                    this.timers = { white: initialWhite, black: initialWhite };
                    this.initGame();
                    this.startTimer();
                    if (this.gameMode === 'cpu' && this.playerColor === 'black') {
                        setTimeout(() => { if (window.game) window.game.cpuMove(); }, 800);
                    } else {
                        this.updateAssistMoves();
                    }
                }
            }

            cancelOnlineRoom() {
                this.sfx.buttonClick();
                if (this.unsubRoom) this.unsubRoom();
                if (this.roomId && this.userId) {
                    try {
                        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                        deleteDoc(roomRef);
                    } catch(e) { console.error(e); }
                }
                this.showModeSelection();
            }

            listenToRoom() {
                if (this.unsubRoom) this.unsubRoom();
                const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                
                this.unsubRoom = onSnapshot(roomRef, (snap) => {
                    if (!snap.exists()) {
                        if (this.gameMode === 'online') {
                            const modal = document.getElementById('confirm-modal');
                            if (modal.style.display !== 'flex') {
                                this.isGameOver = true;
                                this.stopTimer();
                                document.getElementById('rematch-btn').style.display = 'none';
                                this.showConfirm(window.t('disconnectTitle'), window.t('disconnectMsg'), () => { this.showModeSelection(); }, true);
                            }
                        }
                        return;
                    }
                    const data = snap.data();
                    
                    if (data.status === 'abandoned') {
                        const modal = document.getElementById('confirm-modal');
                        if (data.whoAbandoned !== this.userId) {
                            if (modal.style.display !== 'flex') {
                                this.isGameOver = true;
                                this.stopTimer();
                                document.getElementById('rematch-btn').style.display = 'none';
                                let leaverName = window.t('anonymous');
                                if (data.host === data.whoAbandoned) leaverName = data.hostName || window.t('anonymous');
                                else if (data.guest === data.whoAbandoned) leaverName = data.guestName || window.t('anonymous');
                                this.showConfirm(window.t('abandonTitle'), `${leaverName}${window.t('abandonMsg')}`, () => { this.showModeSelection(); }, true);
                            }
                        } else {
                            if (modal.style.display !== 'flex') {
                                this.isGameOver = true;
                                this.stopTimer();
                                document.getElementById('rematch-btn').style.display = 'none';
                                this.showConfirm(window.t('error'), window.t('disconnectErrorMsg'), () => { this.showModeSelection(); }, true);
                            }
                        }
                        return;
                    }
                    
                    if (data.status.startsWith('finished_') || data.status === 'playing') {
                        this.handleOnlineUpdate(data);
                    }
                }, (error) => {
                    console.error("Room listener error:", error);
                });
            }

            forceSyncWithFirestore(gs, data) {
                if (!gs) return;
                this.moveCount = gs.moveCount || 0;
                this.firstMoveDone = { white: this.moveCount > 0, black: this.moveCount > 1 };
                this.turn = gs.turn;
                this.movedStatus = JSON.parse(JSON.stringify(gs.movedStatus || {}));
                this.enPassantTarget = gs.enPassantTarget || null;
                this.baseTimers = { ...gs.timers };
                this.timers = { ...gs.timers };
                this.halfMoveClock = gs.halfMoveClock || 0;
                this.positionHistory = [...(gs.positionHistory || [])];
                this.board = JSON.parse(gs.board);
                this.lastMove = gs.lastMove ? JSON.parse(JSON.stringify(gs.lastMove)) : null;
                this.updateCheckStatus();
                this.updateAdvantageMeter();
                this.updateTimerDisplay();
                this.checkGameEnd(data, gs, this.turn, this.turn);
                this.needsRender = true;
                if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') && !this.isGameOver) {
                    this.saveGameState();
                }
            }

            handleOnlineUpdate(data) {
                const gs = data.gameState || {};
                const oldTurn = this.turn;
                this.currentRoomData = data;
                
                // 再戦の判定を厳密化：ローカルのゲームオーバー状態に依存せず、手数が0に戻ってステータスがplayingなら再戦とみなす
                const isRematch = this.initialized && this.gameMode === 'online' && gs.moveCount === 0 && data.status === 'playing' && this.moveCount > 0;
                
                // リロード復帰などによって切断フラグが立っていた場合、クリアする
                if (gs.disconnected === this.userId) {
                    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', window.game.roomId);
                    updateDoc(roomRef, {
                        'gameState.disconnected': null,
                        'gameState.disconnectedAt': null,
                        [`lastSeen.${this.userId}`]: Date.now()
                    }).catch(()=>{});
                }

                // pagehide等による明示的な切断検知
                if (gs.disconnected && gs.disconnected !== this.userId) {
                    this.isOpponentDisconnected = true;
                    this.opponentDisconnectedAt = gs.disconnectedAt;
                } else {
                    this.isOpponentDisconnected = false;
                    this.opponentDisconnectedAt = null;
                }
                
                if (this.gameMode === 'online' && !isRematch && gs.moveCount <= this.moveCount && this.initialized) {
                    // 追加：タイムアウト等で手数が変わらずに終了ステータスになった場合は必ず処理し、ゲーム終了を相手に伝える
                    if (data.status.startsWith('finished_') && !this.isGameOver) {
                        this.board = JSON.parse(gs.board);
                        this.checkGameEnd(data, gs, oldTurn, gs.turn);
                        return;
                    }

                    // もしFirestore上で自分の番なのに、ローカルでは相手の番になっていたら（送信の失敗・パケットロス）、状態を強制同期する
                    if (gs.turn === this.playerColor && this.turn !== this.playerColor) {
                        this.forceSyncWithFirestore(gs, data);
                        return;
                    }

                    this.processOnlineAck(gs);
                    this.updateLanguageUI();
                    return;
                }

                this.moveCount = gs.moveCount || 0;
                
                this.firstMoveDone = { 
                    white: this.moveCount > 0, 
                    black: this.moveCount > 1 
                };

                const newTurn = gs.turn;
                
                this.movedStatus = JSON.parse(JSON.stringify(gs.movedStatus || {}));
                this.enPassantTarget = gs.enPassantTarget || null;
                
                this.baseTimers = { ...gs.timers };
                this.timers = { ...gs.timers };
                if (gs.lastMoveTimestamp && gs.moveCount > 0) {
                    const elapsedSinceLastMove = (Date.now() - gs.lastMoveTimestamp) / 1000;
                    if (elapsedSinceLastMove > 0) {
                        this.baseTimers[gs.turn] = Math.max(0, this.baseTimers[gs.turn] - elapsedSinceLastMove);
                        this.timers[gs.turn] = this.baseTimers[gs.turn];
                    }
                }
                
                this.turn = gs.turn;
                this.halfMoveClock = gs.halfMoveClock || 0;
                this.positionHistory = [...(gs.positionHistory || [])];
                
                this.opponentAckTime = null;

                if (!this.initialized || this.gameMode !== 'online' || isRematch) {
                    this.gameMode = 'online';
                    this.hideAllOverlays();
                    
                    history.pushState({ playing: true }, '', location.href);

                    document.getElementById('meter-ui').style.display = 'flex';
                    
                    // 盤面の向きの決定：ホストとゲストの情報を優先して判定する
                    if (data.host === this.userId) {
                        this.playerColor = data.white === data.host ? 'white' : 'black';
                    } else if (data.guest === this.userId) {
                        this.playerColor = data.white === data.guest ? 'white' : 'black';
                    } else {
                        this.playerColor = data.white === this.userId ? 'white' : 'black';
                    }

                    this.increment = data.timeConfig.inc;
                    this.useTimer = data.timeConfig.seconds > 0;
                    
                    document.getElementById('undo-btn').style.display = 'none';
                    document.getElementById('rematch-btn').style.display = 'none';
                    document.getElementById('assist-mode-container').style.display = 'none';
                    document.getElementById('auto-rotate-container').style.display = 'none';
                    this.isAssistMode = false;
                    document.getElementById('assist-mode-toggle').checked = false;

                    this.updatePlayerLabels();
                    
                    if (this.useTimer) {
                        document.getElementById('timer-top').style.display = 'inline-block';
                        document.getElementById('timer-bottom').style.display = 'inline-block';
                    }
                    
                    this.initGameLocalVariables();
                    this.moveCount = gs.moveCount || 0;
                    
                    this.positionHistory = [...(gs.positionHistory || [])];
                    this.halfMoveClock = gs.halfMoveClock || 0;

                    this.firstMoveDone = { 
                        white: this.moveCount > 0, 
                        black: this.moveCount > 1 
                    };
                    
                    this.board = JSON.parse(gs.board);
                    this.lastMove = gs.lastMove ? JSON.parse(JSON.stringify(gs.lastMove)) : null;
                    
                    if (gs.moveCount === 0 && this.positionHistory.length === 0) {
                        this.positionHistory.push(this.getPositionString());
                    }
                    
                    this.updateCheckStatus(); 
                    this.previousRankedAdvantage = this.getRankedAdvantage();
                    
                    this.initialized = true;
                    this.isGameOver = false;
                    
                    this.processOnlineAck(gs);

                    this.turnStartTime = Date.now();
                    this.startTimer(); // 無制限でも呼び出す
                    this.updateAdvantageMeter();
                    this.updateTimerDisplay();
                    this.updateLanguageUI();
                    this.updateGameUiInteractivity();
                    
                    this.needsRender = true;
                    return;
                }

                this.processOnlineAck(gs);

                const isOpponentMove = (oldTurn !== newTurn && newTurn === this.playerColor && gs.lastMove);

                if (isOpponentMove && !this.animatingPiece) {
                    // タブがバックグラウンドの場合などはアニメーションをスキップして即時反映させるフェールセーフ
                    if (document.visibilityState === 'hidden') {
                        this.board = JSON.parse(gs.board);
                        this.lastMove = gs.lastMove ? JSON.parse(JSON.stringify(gs.lastMove)) : null;
                        this.updateCheckStatus();
                        this.updateAdvantageMeter();
                        this.updateTimerDisplay();
                        this.checkGameEnd(data, gs, oldTurn, newTurn);
                        this.needsRender = true;
                        return;
                    }

                    const isCapture = this.board[gs.lastMove.to.y][gs.lastMove.to.x] !== null || gs.lastMove.isEnPassant;
                    
                    this.animatingPiece = {
                        piece: this.board[gs.lastMove.from.y][gs.lastMove.from.x] || (oldTurn === 'white' ? 'P' : 'p'),
                        from: gs.lastMove.from,
                        to: gs.lastMove.to,
                        progress: 0,
                        isOpponent: true,
                        targetBoard: JSON.parse(gs.board), 
                        isCapture: isCapture,
                        data: data,
                        oldTurn: oldTurn,
                        newTurn: newTurn
                    };
                    
                    this.board[gs.lastMove.from.y][gs.lastMove.from.x] = null;
                    if (gs.lastMove.isEnPassant) {
                        const dir = this.animatingPiece.piece === 'P' ? 1 : -1;
                        this.board[gs.lastMove.to.y + dir][gs.lastMove.to.x] = null;
                    }
                    
                    this.lastMove = gs.lastMove ? JSON.parse(JSON.stringify(gs.lastMove)) : null;
                    this.updateTimerDisplay();
                    this.needsRender = true;
                } else {
                    this.board = JSON.parse(gs.board);
                    this.lastMove = gs.lastMove ? JSON.parse(JSON.stringify(gs.lastMove)) : null;
                    this.updateCheckStatus();
                    this.updateAdvantageMeter();
                    this.updateTimerDisplay();
                    this.checkGameEnd(data, gs, oldTurn, newTurn);
                    this.needsRender = true;
                }
            }

            handleEngineMove(moveStr) {
                const fromX = moveStr.charCodeAt(0) - 97; // 'a' is 97
                const fromY = 8 - parseInt(moveStr[1]);
                const toX = moveStr.charCodeAt(2) - 97;
                const toY = 8 - parseInt(moveStr[3]);
                const promotion = moveStr.length > 4 ? moveStr[4] : null;

                const allMoves = this.getAllValidMoves(this.turn, this.board, this.enPassantTarget);
                const engineMove = allMoves.find(m => m.from.x === fromX && m.from.y === fromY && m.to.x === toX && m.to.y === toY);

                if (engineMove) {
                    engineMove.promotion = promotion;
                    this.startMove(engineMove);
                } else {
                    this.fallbackCpuMove();
                }
            }

            checkGameEnd(data, gs, oldTurn, newTurn) {
                if (data.status === 'finished_mate') {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.stopTimer();
                    this.sfx.checkmate();
                    const winnerColor = gs.turn === 'white' ? 'black' : 'white';
                    this.showWinLoseMessage(window.t('checkmate'), winnerColor);
                    this.showRematchButton();
                } else if (data.status === 'finished_stalemate') {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.stopTimer();
                    this.sfx.checkmate();
                    this.showDrawMessage(window.t('stalemate'));
                    this.showRematchButton();
                } else if (data.status === 'finished_insufficient') {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.stopTimer();
                    this.sfx.checkmate();
                    this.showDrawMessage(window.t('insufficientMaterial'));
                    this.showRematchButton();
                } else if (data.status === 'finished_threefold') {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.stopTimer();
                    this.sfx.checkmate();
                    this.showDrawMessage(window.t('threefoldRepetition'));
                    this.showRematchButton();
                } else if (data.status === 'finished_fiftymove') {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.stopTimer();
                    this.sfx.checkmate();
                    this.showDrawMessage(window.t('fiftyMoveRule'));
                    this.showRematchButton();
                } else if (data.status === 'finished_timeout') {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.stopTimer();
                    this.sfx.checkmate();
                    const winnerColor = data.winner;
                    this.showWinLoseMessage(window.t('timeout'), winnerColor);
                    this.showRematchButton();
                } else {
                    if (this.inCheckPos) this.sfx.check(); 
                    
                    this.updateLanguageUI();
                    
                    if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') && this.turn !== this.playerColor) {
                        setTimeout(() => { if (window.game) window.game.cpuMove(); }, 400);
                    } else if (this.gameMode !== 'online' && this.gameMode !== 'cpu_ranked' || this.turn === this.playerColor) {
                        this.updatePageInfoForAssist();
                    }
                }
                this.needsRender = true;
            }

            showWinLoseMessage(reason, winnerColor) {
                let rateStr = "";
                if (this.gameMode === 'cpu_ranked') {
                    const result = winnerColor === this.playerColor ? 'win' : 'lose';
                    rateStr = this.updateRankedScore(result);
                }
                if (this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') {
                    this.clearPersistentGameState();
                }

                if (this.gameMode === 'pvp') {
                    const winnerText = winnerColor === 'white' ? window.t('p1White') : window.t('p2Black');
                    this.updateStatus(`${reason} ${winnerText}${window.t('winSuffix')}`);
                } else if (this.gameMode === 'online') {
                    if (winnerColor === this.playerColor) {
                        this.updateStatus(`${reason} ${window.t('youWin')}`);
                    } else {
                        this.updateStatus(`${reason} ${window.t('youLose')}`);
                    }
                } else {
                    if (winnerColor === this.playerColor) {
                        this.updateStatus(`${reason} ${window.t('youWin')}${rateStr}`);
                    } else {
                        this.updateStatus(`${reason} ${window.t('youLose')}${rateStr}`);
                    }
                }
            }

            showDrawMessage(reason) {
                let rateStr = "";
                if (this.gameMode === 'cpu_ranked') {
                    rateStr = this.updateRankedScore('draw');
                }
                if (this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') {
                    this.clearPersistentGameState();
                }
                this.updateStatus(`${reason} - ${window.t('drawMsg')}${rateStr}`);
            }
            
            showTurnMessage(prefix) {
                if (this.gameMode === 'pvp') {
                    const turnText = this.turn === 'white' ? window.t('whiteTurn') : window.t('blackTurn');
                    this.updateStatus(prefix + turnText);
                } else {
                    const turnText = this.turn === this.playerColor ? window.t('yourTurn') : window.t('opponentTurn');
                    this.updateStatus(prefix + turnText);
                }
            }

            showRematchButton() {
                if (this.gameMode === 'online' && !this.isHost) return;
                const rematchBtn = document.getElementById('rematch-btn');
                if (rematchBtn) {
                    rematchBtn.style.display = 'inline-block';
                    setTimeout(() => rematchBtn.focus(), 0);
                }
                this.updateGameUiInteractivity();
            }

            processOnlineAck(gs) {
                if (!gs || !this.roomId) return;
                const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                if (gs.turn === this.playerColor) {
                    if (gs.ack === false) {
                        updateDoc(roomRef, { 'gameState.ack': true }).catch(() => {});
                    }
                    this.turnStartTime = Date.now();
                } else {
                    if (gs.ack === true && !this.opponentAckTime) {
                        this.opponentAckTime = Date.now();
                    }
                }
            }

            async handleDisconnectWin() {
                this.stopTimer();
                this.isGameOver = true;
                sessionStorage.removeItem('chessGameState');
                this.sfx.checkmate(); 
                
                try {
                    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                    const opponentId = this.currentRoomData.white === this.userId ? this.currentRoomData.black : this.currentRoomData.white;
                    await updateDoc(roomRef, {
                        status: 'abandoned',
                        whoAbandoned: opponentId
                    });
                } catch(e) { console.error(e); }
            }

            async sendOnlineMove(isCheckmate, isStalemate, isInsufficient, isThreefold, isFiftyMove) {
                if (!this.roomId) return;
                try {
                    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                    let status = 'playing';
                    if (isCheckmate) status = 'finished_mate';
                    else if (isStalemate) status = 'finished_stalemate';
                    else if (isInsufficient) status = 'finished_insufficient';
                    else if (isThreefold) status = 'finished_threefold';
                    else if (isFiftyMove) status = 'finished_fiftymove';
                    
                    await updateDoc(roomRef, {
                        status: status,
                        'gameState.board': JSON.stringify(this.board),
                        'gameState.turn': this.turn,
                        'gameState.timers': this.timers, 
                        'gameState.movedStatus': this.movedStatus,
                        'gameState.enPassantTarget': this.enPassantTarget || null,
                        'gameState.lastMove': this.lastMove ? JSON.parse(JSON.stringify(this.lastMove)) : null,
                        'gameState.moveCount': this.moveCount,
                        'gameState.halfMoveClock': this.halfMoveClock,
                        'gameState.positionHistory': this.positionHistory,
                        'gameState.ack': false,
                        'gameState.lastMoveTimestamp': Date.now()
                    });
                } catch(e) { 
                    console.error(e); 
                    // 送信に失敗した場合（通信切断時など）は強制的に元の状態にロールバックしてやり直しを促す
                    if (this.currentRoomData) {
                        this.forceSyncWithFirestore(this.currentRoomData.gameState, this.currentRoomData);
                    }
                    this.showConfirm(window.t('error'), window.t('commError'), ()=>{}, true);
                }
            }

            async sendTimeout() {
                if (!this.roomId || this.gameMode !== 'online') return;
                try {
                    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', this.roomId);
                    await updateDoc(roomRef, {
                        status: 'finished_timeout',
                        winner: this.turn === 'white' ? 'black' : 'white'
                    });
                } catch(e) { console.error(e); }
            }

            startWithTime(seconds, inc) {
                if (this.tempMode === 'online') {
                    const turnMode = document.getElementById('online-turn-select').value;
                    this.createOnlineRoom(seconds, inc, turnMode);
                    return;
                }

                this.sfx.buttonClick();
                this.gameMode = this.tempMode;
                
                // 修正: フリー対局は1〜50の50段階マッピングで開始
                this.aiLevel = this.tempLevel;
                this.baseAiLevel = this.tempLevel; // 初期レベルを保存
                this.aiElo = 250 + (this.aiLevel - 1) * 45; // レート表示用にマッピング
                this.baseAiElo = this.aiElo;
                
                this.initialTimeSec = seconds;
                this.timers = { white: seconds, black: seconds };
                this.increment = inc;
                this.useTimer = seconds > 0;
                this.isAssistMode = document.getElementById('assist-mode-toggle').checked;
                this.hideAllOverlays();
                
                document.getElementById('undo-btn').style.display = 'inline-block';
                document.getElementById('rematch-btn').style.display = 'none';
                document.getElementById('meter-ui').style.display = 'flex';
                document.getElementById('assist-mode-container').style.display = 'flex';
                
                if (this.gameMode === 'pvp') {
                    document.getElementById('auto-rotate-container').style.display = 'flex';
                } else {
                    document.getElementById('auto-rotate-container').style.display = 'none';
                }
                
                const topTimer = document.getElementById('timer-top');
                const bottomTimer = document.getElementById('timer-bottom');

                if (this.gameMode === 'cpu') {
                    this.playerColor = Math.random() < 0.5 ? 'white' : 'black';
                } else {
                    this.playerColor = 'white';
                }
                
                this.updatePlayerLabels();

                if (this.useTimer) {
                    topTimer.style.display = 'inline-block';
                    bottomTimer.style.display = 'inline-block';
                    this.updateTimerDisplay();
                } else {
                    topTimer.style.display = 'none';
                    bottomTimer.style.display = 'none';
                }

                this.initGame();
                this.updateGameUiInteractivity();
                this.startTimer(); // 無制限でも呼ぶ
                this.saveGameState();
                if (this.gameMode === 'cpu' && this.playerColor === 'black') {
                    setTimeout(() => { if (window.game) window.game.cpuMove(); }, 800);
                } else {
                    this.updateAssistMoves();
                }
            }

            initGameLocalVariables() {
                this.isGameOver = false;
                this.history = [];
                this.lastMove = null;
                this.selected = null;
                this.animatingPiece = null;
                this.inCheckPos = null;
                this.moveCount = 0;
                this.firstMoveDone = { white: false, black: false }; 
                this.halfMoveClock = 0;
                this.positionHistory = [];
                this.opponentAckTime = null;
                this.isOpponentDisconnected = false;
                this.opponentDisconnectedAt = null;
                this.enPassantTarget = null;
                this.draggingPiece = null;
                this.isThinkingForCpu = false;
                this.isAssistModeThinking = false;
                this.tempAssistMoves = [];
                this.kingHasBeenInCheck = { white: false, black: false };
                this.validMoves = [];
            }

            initGame() {
                this.board = [
                    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                    Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
                    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
                ];
                this.movedStatus = {
                    whiteKing: false, blackKing: false,
                    whiteRookLeft: false, whiteRookRight: false,
                    blackRookLeft: false, blackRookRight: false
                };
                this.turn = 'white';
                this.initGameLocalVariables();
                this.boardCursor = this.playerColor === 'black' ? { x: 3, y: 1 } : { x: 3, y: 6 };
                
                this.positionHistory.push(this.getPositionString());
                
                this.updateCheckStatus(); 
                this.initialized = true;
                this.previousRankedAdvantage = this.getRankedAdvantage();
                
                this.turnStartTime = Date.now();
                this.baseTimers = { ...this.timers };
                
                this.showTurnMessage("");
                this.updateAdvantageMeter();
                this.updateMoveCountDisplay();
                this.updateRotationUI();
                this.needsRender = true;
                this.updateGameUiInteractivity();
                this.saveGameState();
            }

            startTimer() {
                this.stopTimer();
                this.turnStartTime = Date.now();
                this.baseTimers = { white: this.timers.white, black: this.timers.black };
                
                let lastSec = Math.floor(this.timers[this.turn] || 0);
                this.waitingForOpponentTimeout = false;
                this.opponentTimeoutGrace = 0;

                const now = Date.now();

                this.timerInterval = setInterval(() => {
                    const now = Date.now();
                    let elapsed = 0;
                    
                    const isGameStart = (this.gameMode === 'online') ? (this.moveCount === 0) : (this.history.length === 0);
                    
                    if (isGameStart) {
                        this.turnStartTime = now;
                        elapsed = 0;
                    } else if (this.gameMode === 'online') {
                        if (this.turn !== this.playerColor) {
                            if (!this.currentRoomData || !this.currentRoomData.gameState || !this.currentRoomData.gameState.ack) {
                                elapsed = 0;
                            } else {
                                if (!this.opponentAckTime) this.opponentAckTime = now;
                                elapsed = (now - this.opponentAckTime) / 1000;
                            }
                        } else {
                            elapsed = (now - this.turnStartTime) / 1000;
                        }
                    } else {
                        elapsed = (now - this.turnStartTime) / 1000;
                    }
                    
                    if (this.useTimer) {
                        this.timers[this.turn] = Math.max(0, this.baseTimers[this.turn] - elapsed);

                        const currentSec = Math.floor(this.timers[this.turn]);

                        if (currentSec < 10 && currentSec >= 0 && currentSec !== lastSec) {
                            if (this.gameMode !== 'online' || this.turn === this.playerColor) {
                                if (!isGameStart && elapsed > 0) {
                                    this.sfx.countdown();
                                }
                            }
                        }
                        lastSec = currentSec;

                        if (this.timers[this.turn] <= 0 && !this.isGameOver) { 
                            this.timers[this.turn] = 0; 
                            if (this.gameMode === 'online') {
                                if (this.turn === this.playerColor) {
                                    this.handleTimeout(); 
                                } else {
                                    if (!this.waitingForOpponentTimeout) {
                                        this.waitingForOpponentTimeout = true;
                                        this.opponentTimeoutGrace = 0;
                                        const checkStr = this.inCheckPos ? window.t('checkWarning') : "";
                                        const turnText = this.turn === this.playerColor ? window.t('yourTurn') : window.t('opponentTurn');
                                        this.updateStatus(checkStr + turnText + " - " + window.t('waitingCommunication'));
                                    } else {
                                        // 100ms周期に合わせた計算 (100ms = 0.1秒)
                                        this.opponentTimeoutGrace += 0.1;
                                        if (this.opponentTimeoutGrace >= 30) {
                                            this.handleTimeout();
                                        }
                                    }
                                }
                            } else {
                                this.handleTimeout(); 
                            }
                        }
                    }
                    this.updateTimerDisplay();
                    if (this.gameMode !== 'online' && (this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked')) {
                        if (!this.lastPersistentSaveAt || now - this.lastPersistentSaveAt >= 10000) {
                            this.lastPersistentSaveAt = now;
                            this.saveGameState();
                        }
                    }

                    if (!this.isGameOver && this.gameMode === 'online' && this.currentRoomData && this.currentRoomData.status === 'playing') {
                        const opponentId = this.currentRoomData.white === this.userId ? this.currentRoomData.black : this.currentRoomData.white;
                        let isOffline = false;
                        let offlineTime = 0;

                        if (opponentId && this.currentRoomData.lastSeen && this.currentRoomData.lastSeen[opponentId]) {
                            offlineTime = (now - this.currentRoomData.lastSeen[opponentId]) / 1000;
                            if (offlineTime > 10) {
                                isOffline = true;
                            }
                        }
                        
                        if (this.isOpponentDisconnected && this.opponentDisconnectedAt) {
                            isOffline = true;
                            offlineTime = Math.max(offlineTime, (now - this.opponentDisconnectedAt) / 1000);
                        }

                        // 自分がオフライン（ネット未接続）のときは、相手の切断カウントダウンを進めない
                        if (!navigator.onLine) {
                            isOffline = false;
                        }

                        if (isOffline) {
                            const remainingGrace = Math.max(0, 30 - Math.floor(offlineTime));
                            const checkStr = this.inCheckPos ? window.t('checkWarning') : "";
                            this.updateStatus(checkStr + window.t('opponentDisconnectedMsg') + ` (${remainingGrace}s)`);

                            if (offlineTime >= 30) {
                                this.handleDisconnectWin();
                            }
                        } else if (this.turn !== this.playerColor && this.waitingForOpponentTimeout) {
                            
                        } else if (this.turn !== this.playerColor && !this.currentRoomData?.gameState?.ack) {
                            
                        } else {
                            const checkStr = this.inCheckPos ? window.t('checkWarning') : "";
                            this.showTurnMessage(checkStr);
                        }
                    } else if (!this.isGameOver) {
                        const checkStr = this.inCheckPos ? window.t('checkWarning') : "";
                        this.showTurnMessage(checkStr);
                    }

                }, 100); // 50msから100msに変更してUIの更新負荷を半減
            }

            stopTimer() { clearInterval(this.timerInterval); }

            handleTimeout() {
                this.stopTimer();
                this.isGameOver = true;
                sessionStorage.removeItem('chessGameState');
                this.sfx.checkmate(); 
                const winnerColor = this.turn === 'white' ? 'black' : 'white';
                this.showWinLoseMessage(window.t('timeout'), winnerColor);
                this.showRematchButton();
                
                if (this.gameMode === 'online' && this.turn === this.playerColor) {
                    this.sendTimeout();
                }
            }

            updateTimerDisplay() {
                const fmt = s => {
                    const m = Math.floor(Math.max(0, s)/60); 
                    const sc = Math.floor(Math.max(0, s)%60);
                    if (s < 10 && s > 0) {
                        return `${m}:${sc.toString().padStart(2,'0')}.${Math.floor((Math.max(0, s)%1)*10)}`;
                    } else {
                        return `${m}:${sc.toString().padStart(2,'0')}`;
                    }
                };
                const topTimer = document.getElementById('timer-top');
                const bottomTimer = document.getElementById('timer-bottom');
                
                let bottomText = "";
                let topText = "";

                if (this.playerColor === 'white') {
                    bottomText = fmt(this.timers.white);
                    topText = fmt(this.timers.black);
                } else {
                    bottomText = fmt(this.timers.black);
                    topText = fmt(this.timers.white);
                }

                if (bottomTimer.innerText !== bottomText) bottomTimer.innerText = bottomText;
                if (topTimer.innerText !== topText) topTimer.innerText = topText;

                if (this.isGameOver) {
                    this.clearActiveStyles();
                } else {
                    const isWhiteTurn = this.turn === 'white';
                    const isBlackTurn = this.turn === 'black';
                    
                    const bottomIsWhite = this.playerColor === 'white';
                    
                    if (bottomIsWhite) {
                        if (bottomTimer.classList.contains('timer-active') !== isWhiteTurn) bottomTimer.classList.toggle('timer-active', isWhiteTurn);
                        if (topTimer.classList.contains('timer-active') !== isBlackTurn) topTimer.classList.toggle('timer-active', isBlackTurn);
                    } else {
                        if (bottomTimer.classList.contains('timer-active') !== isBlackTurn) bottomTimer.classList.toggle('timer-active', isBlackTurn);
                        if (topTimer.classList.contains('timer-active') !== isWhiteTurn) topTimer.classList.toggle('timer-active', isWhiteTurn);
                    }
                }
            }

            updateAdvantageMeter() {
                let whiteScore = 0;
                let blackScore = 0;

                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const p = this.board[y][x];
                        if (!p) continue;
                        const val = DISPLAY_MATERIAL_VALUES[p] || 0;
                        if (p === p.toUpperCase()) whiteScore += val;
                        else blackScore += val;
                    }
                }

                const diff = whiteScore - blackScore;
                
                let displayDiff = diff;
                const meterUi = document.getElementById('meter-ui');
                if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked' || this.gameMode === 'online') && this.playerColor === 'black') {
                    displayDiff = blackScore - whiteScore;
                    meterUi.style.flexDirection = 'row-reverse';
                } else {
                    meterUi.style.flexDirection = 'row';
                }
                
                let whitePercent = 50 + (diff * 2);
                whitePercent = Math.max(5, Math.min(95, whitePercent));
                
                document.getElementById('advantage-bar-white').style.width = `${whitePercent}%`;
                const text = displayDiff > 0 ? `+${displayDiff}` : (displayDiff < 0 ? `${displayDiff}` : "0");
                document.getElementById('advantage-text').innerText = text;
            }

            startMove(move) {
                if (this.gameMode !== 'online') {
                    this.history.push(JSON.stringify({ 
                        board: this.board.map(r => [...r]), 
                        timers: { ...this.timers },
                        lastMove: this.lastMove ? {...this.lastMove} : null,
                        movedStatus: { ...this.movedStatus },
                        enPassantTarget: this.enPassantTarget ? { ...this.enPassantTarget } : null,
                        halfMoveClock: this.halfMoveClock,
                        positionHistory: [...this.positionHistory],
                        moveCount: this.moveCount,
                        firstMoveDone: { ...this.firstMoveDone },
                        turn: this.turn
                    }));
                }

                const piece = this.board[move.from.y][move.from.x];
                this.animatingPiece = { piece, from: move.from, to: move.to, progress: 0, move };
                if (move.promotion) {
                    this.animatingPiece.promotion = move.promotion;
                }
                this.board[move.from.y][move.from.x] = null;
                const isPlayerDrivenMove = this.gameMode === 'pvp' || this.turn === this.playerColor;
                if (isPlayerDrivenMove) {
                    this.boardCursor = { x: move.to.x, y: move.to.y };
                }
                this.selected = null;
                this.draggingPiece = null;
                this.needsRender = true;
            }

            executeMove(move) {
                if (this.useTimer) {
                    if (!this.firstMoveDone[this.turn]) {
                        this.firstMoveDone[this.turn] = true;
                    } else {
                        this.timers[this.turn] += this.increment;
                    }
                }
                
                const piece = this.animatingPiece.piece;
                const isCapture = this.board[move.to.y][move.to.x] !== null || move.isEnPassant; 
                const isPawnMove = piece.toLowerCase() === 'p';

                move.piece = piece;
                move.isCapture = isCapture;

                if (isCapture || isPawnMove) {
                    this.halfMoveClock = 0;
                    this.positionHistory = []; 
                } else {
                    this.halfMoveClock++;
                }
                
                this.moveCount++;
                
                if (move.isCastling) {
                    const rookY = move.from.y;
                    const oldRookX = move.to.x === 6 ? 7 : 0;
                    const newRookX = move.to.x === 6 ? 5 : 3;
                    this.board[rookY][newRookX] = this.board[rookY][oldRookX];
                    this.board[rookY][oldRookX] = null;
                }

                if (move.isEnPassant) {
                    const dir = piece === 'P' ? 1 : -1;
                    this.board[move.to.y + dir][move.to.x] = null;
                }

                this.board[move.to.y][move.to.x] = piece;
                
                if (piece === 'K') this.movedStatus.whiteKing = true;
                if (piece === 'k') this.movedStatus.blackKing = true;
                if (move.from.x === 0 && move.from.y === 7) this.movedStatus.whiteRookLeft = true;
                if (move.from.x === 7 && move.from.y === 7) this.movedStatus.whiteRookRight = true;
                if (move.from.x === 0 && move.from.y === 0) this.movedStatus.blackRookLeft = true;
                if (move.from.x === 7 && move.from.y === 0) this.movedStatus.blackRookRight = true;

                if (move.isDoublePawn) {
                    const dir = piece === 'P' ? -1 : 1;
                    this.enPassantTarget = { x: move.from.x, y: move.from.y + dir };
                } else {
                    this.enPassantTarget = null;
                }

                this.lastMove = move;
                this.animatingPiece = null;
                
                if (isCapture) {
                    this.sfx.pieceCapture(); 
                } else {
                    this.sfx.pieceMove(); 
                }
                
                this.updateAdvantageMeter();

                if ((piece === 'P' && move.to.y === 0) || (piece === 'p' && move.to.y === 7)) {
                    if (this.animatingPiece && this.animatingPiece.promotion) {
                        const pChar = this.animatingPiece.promotion;
                        this.board[move.to.y][move.to.x] = this.turn === 'white' ? pChar.toUpperCase() : pChar.toLowerCase();
                        this.updateAdvantageMeter();
                        this.finalizeTurn();
                        this.needsRender = true;
                    }
                    else if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked' || this.gameMode === 'online') && this.turn !== this.playerColor) {
                        this.board[move.to.y][move.to.x] = this.turn === 'white' ? 'Q' : 'q';
                        this.updateAdvantageMeter();
                        this.finalizeTurn();
                        this.needsRender = true;
                    } else {
                        this.pendingPromotion = move;
                        const promotionModal = document.getElementById('promotion-modal');
                        if (promotionModal) {
                            promotionModal.style.display = 'flex';
                            const firstChoice = promotionModal.querySelector('[onclick*="selectPromotion"]');
                            if (firstChoice) firstChoice.focus();
                        }
                        this.needsRender = true;
                    }
                } else { 
                    this.finalizeTurn(); 
                    this.needsRender = true;
                }
            }

            selectPromotion(char) {
                this.sfx.buttonClick();
                const p = this.turn === 'white' ? char.toUpperCase() : char.toLowerCase();
                this.board[this.pendingPromotion.to.y][this.pendingPromotion.to.x] = p;
                document.getElementById('promotion-modal').style.display = 'none';
                
                // 棋譜と相手への送信用にプロモーション情報を記録
                this.pendingPromotion.promotion = char.toUpperCase();
                if (this.lastMove) {
                    this.lastMove.promotion = char.toUpperCase();
                }
                
                this.pendingPromotion = null;
                this.updateAdvantageMeter();
                this.finalizeTurn();
                this.needsRender = true;
            }

            toggleAssistMode(checked) {
                this.sfx.buttonClick();
                this.isAssistMode = checked;
                const assistToggle = document.getElementById('assist-mode-toggle');
                if (assistToggle && assistToggle.checked !== checked) {
                    assistToggle.checked = checked;
                }
                if (this.isAssistMode) {
                    this.updateAssistMoves();
                } else {
                    this.assistMoves = [];
                    this.tempAssistMoves = [];
                    this.isAssistModeThinking = false;
                    this.needsRender = true;
                    if (this.stockfish && !this.isThinkingForCpu) {
                         this.stockfish.postMessage("stop");
                    }
                }
            }

            updateAssistMoves() {
                this.assistMoves = [];
                this.tempAssistMoves = [];
                this.needsRender = true;

                if (!this.isAssistMode || this.isGameOver || !this.initialized) return;
                if (this.gameMode === 'online') return;
                if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') && this.turn !== this.playerColor) return;

                if (this.stockfish) {
                    this.stockfish.postMessage("stop");
                    this.isAssistModeThinking = true;
                    this.isThinkingForCpu = false;
                    this.stockfish.postMessage("setoption name MultiPV value 3");
                    this.stockfish.postMessage("setoption name Skill Level value 20");
                    this.stockfish.postMessage("position fen " + this.getFen());
                    this.stockfish.postMessage("go depth 12");
                } else {
                    setTimeout(() => {
                        const all = this.getAllValidMoves(this.turn, this.board, this.enPassantTarget);
                        if (all.length === 0) return;

                        const DEPTH = 2;

                        all.forEach(m => {
                            const tempBoard = this.applyMove(this.board, m);
                            const nextEnPassantTarget = m.isDoublePawn ? { x: m.from.x, y: m.from.y + (this.board[m.from.y][m.from.x] === 'P' ? -1 : 1) } : null;
                            let score = this.minimax(tempBoard, DEPTH - 1, -Infinity, Infinity, false, this.turn, nextEnPassantTarget);
                            if (m.isCastling) score += 50;
                            m.evalScore = score + Math.random() * 0.1;
                        });

                        all.sort((a,b) => b.evalScore - a.evalScore);
                        this.assistMoves = all.slice(0, 3);
                        this.needsRender = true;
                    }, 10);
                }
            }

            getAllValidMoves(color, board, epTarget = this.enPassantTarget) {
                const moves = [];
                for (let y=0; y<8; y++) {
                    for (let x=0; x<8; x++) {
                        const p = board[y][x];
                        if (p && (color === 'white' ? p === p.toUpperCase() : p === p.toLowerCase())) {
                            moves.push(...this.getMoves(x,y,board, false, epTarget));
                        }
                    }
                }
                return moves;
            }

            applyMove(board, move) {
                const t = board.map(r => [...r]);
                let piece = t[move.from.y][move.from.x];

                if (move.isCastling) {
                    const oldRookX = move.to.x === 6 ? 7 : 0;
                    const newRookX = move.to.x === 6 ? 5 : 3;
                    t[move.to.y][newRookX] = t[move.to.y][oldRookX];
                    t[move.to.y][oldRookX] = null;
                }

                if (move.isEnPassant) {
                    const dir = piece === 'P' ? 1 : -1;
                    t[move.to.y + dir][move.to.x] = null;
                }

                t[move.to.y][move.to.x] = piece;
                t[move.from.y][move.from.x] = null;

                if ((piece === 'P' && move.to.y === 0) || (piece === 'p' && move.to.y === 7)) {
                    t[move.to.y][move.to.x] = piece === 'P' ? 'Q' : 'q';
                }

                return t;
            }

            evaluateBoardForMinimax(board, maximizingColor) {
                let score = 0;
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const p = board[y][x];
                        if (!p) continue;

                        const isWhite = p === p.toUpperCase();
                        const isMaximizing = maximizingColor === 'white' ? isWhite : !isWhite;
                        const pType = p.toLowerCase();
                        let val = AI_VALUES[pType] * 10;

                        if (pType === 'n' || pType === 'b' || pType === 'p') {
                            if (x >= 3 && x <= 4 && y >= 3 && y <= 4) val += 6;
                            else if (x >= 2 && x <= 5 && y >= 2 && y <= 5) val += 3;
                        }

                        if (isMaximizing) {
                            score += val;
                        } else {
                            score -= val;
                        }
                    }
                }
                return score;
            }

            minimax(board, depth, alpha, beta, isMaximizingPlayer, maximizingColor, currentEnPassantTarget = null) {
                if (depth === 0) {
                    return this.evaluateBoardForMinimax(board, maximizingColor);
                }

                const currentColor = isMaximizingPlayer ? maximizingColor : (maximizingColor === 'white' ? 'black' : 'white');
                const moves = this.getAllValidMoves(currentColor, board, currentEnPassantTarget);

                if (moves.length === 0) {
                    if (this.isInCheck(currentColor, board)) {
                        return isMaximizingPlayer ? -99999 + depth : 99999 - depth;
                    }
                    return 0; 
                }

                moves.sort((a,b) => {
                    const targetA = board[a.to.y][a.to.x];
                    const targetB = board[b.to.y][b.to.x];
                    let scoreA = targetA ? AI_VALUES[targetA.toLowerCase()] : 0;
                    let scoreB = targetB ? AI_VALUES[targetB.toLowerCase()] : 0;
                    if (a.isEnPassant) scoreA = 10; 
                    if (b.isEnPassant) scoreB = 10;
                    return scoreB - scoreA;
                });

                if (isMaximizingPlayer) {
                    let maxEval = -Infinity;
                    for (const m of moves) {
                        const tempBoard = this.applyMove(board, m);
                        const nextEnPassantTarget = m.isDoublePawn ? { x: m.from.x, y: m.from.y + (board[m.from.y][m.from.x] === 'P' ? -1 : 1) } : null;
                        const ev = this.minimax(tempBoard, depth - 1, alpha, beta, false, maximizingColor, nextEnPassantTarget);
                        maxEval = Math.max(maxEval, ev);
                        alpha = Math.max(alpha, ev);
                        if (beta <= alpha) break;
                    }
                    return maxEval;
                } else {
                    let minEval = Infinity;
                    for (const m of moves) {
                        const tempBoard = this.applyMove(board, m);
                        const nextEnPassantTarget = m.isDoublePawn ? { x: m.from.x, y: m.from.y + (board[m.from.y][m.from.x] === 'P' ? -1 : 1) } : null;
                        const ev = this.minimax(tempBoard, depth - 1, alpha, beta, true, maximizingColor, nextEnPassantTarget);
                        minEval = Math.min(minEval, ev);
                        beta = Math.min(beta, ev);
                        if (beta <= alpha) break;
                    }
                    return minEval;
                }
            }

            updateCheckStatus() {
                this.inCheckPos = null;
                if (this.isInCheck(this.turn, this.board)) {
                    const kingChar = this.turn === 'white' ? 'K' : 'k';
                    for (let y = 0; y < 8; y++) {
                        for (let x = 0; x < 8; x++) {
                            if (this.board[y][x] === kingChar) {
                                this.inCheckPos = { x, y };
                                break;
                            }
                        }
                    }
                    this.kingHasBeenInCheck[this.turn] = true;
                }
            }

            clearActiveStyles() {
                const bottomLabel = document.getElementById('bottom-player-label');
                const topLabel = document.getElementById('top-player-label');
                if (bottomLabel && topLabel) {
                    bottomLabel.classList.remove('text-blue-400');
                    bottomLabel.classList.add('opacity-70');
                    topLabel.classList.remove('text-blue-400');
                    topLabel.classList.add('opacity-70');
                }
                const bottomTimer = document.getElementById('timer-bottom');
                const topTimer = document.getElementById('timer-top');
                if (bottomTimer && topTimer) {
                    bottomTimer.classList.remove('timer-active');
                    topTimer.classList.remove('timer-active');
                }
            }

            finalizeTurn() {
                this.turn = this.turn === 'white' ? 'black' : 'white';
                this.assistMoves = [];
                
                // プレイヤーの動き（有利不利）を分析してAIの推定ELO・レベルを調整するロジック
                if (this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') {
                    let myScore = 0;
                    let cpuScore = 0;
                    for (let y = 0; y < 8; y++) {
                        for (let x = 0; x < 8; x++) {
                            const p = this.board[y][x];
                            if (!p) continue;
                            const val = DISPLAY_MATERIAL_VALUES[p] || 0;
                            const isWhite = p === p.toUpperCase();
                            if ((this.playerColor === 'white' && isWhite) || (this.playerColor === 'black' && !isWhite)) {
                                myScore += val;
                            } else {
                                cpuScore += val;
                            }
                        }
                    }
                    
                    const advantage = myScore - cpuScore;
                    
                    if (this.gameMode === 'cpu_ranked') {
                        // ランクマッチでは、プレイヤーの手番終了後にのみ CPU の推定ELOを調整して
                        // 自分の指し手評価に応じた変化をより安定させる。
                        const previousMoveByPlayer = this.turn !== this.playerColor;
                        if (previousMoveByPlayer) {
                            const currentAdvantage = this.getRankedAdvantage();
                            const advantageDelta = currentAdvantage - (this.previousRankedAdvantage ?? currentAdvantage);
                            const eloStep = this.getRankedEloStep(advantageDelta);
                            this.previousRankedAdvantage = currentAdvantage;

                            if (eloStep !== 0) {
                                this.aiElo = Math.max(250, Math.min(3000, this.aiElo + eloStep));
                            }
                        }
                        this.aiLevel = Math.max(1, Math.min(50, Math.round((this.aiElo - 250) / 45.9) + 1));
                    } else if (this.gameMode === 'cpu_ranked') {
                        // ランクマッチのみ、プレイヤーの内容に応じて内部難易度を変動させる
                        let targetLevel = this.baseAiLevel + advantage + Math.floor(this.moveCount / 10);
                        targetLevel = Math.max(1, Math.min(50, targetLevel));

                        if (targetLevel > this.aiLevel) {
                            this.aiLevel = Math.min(50, this.aiLevel + 1);
                        } else if (targetLevel < this.aiLevel) {
                            this.aiLevel = Math.max(1, this.aiLevel - 1);
                        }
                        this.aiElo = 250 + (this.aiLevel - 1) * 45; // 45刻み、上限2500近く
                    }
                }
                
                this.turnStartTime = Date.now();
                this.baseTimers = { ...this.timers };
                
                this.updateCheckStatus();
                
                const noMoves = this.isMate();
                const isCheckmate = noMoves && this.inCheckPos !== null;
                const isStalemate = noMoves && this.inCheckPos === null;
                const isInsufficient = this.isInsufficientMaterial();

                if (this.lastMove) {
                    this.lastMove.isCheck = this.inCheckPos !== null;
                    this.lastMove.isCheckmate = isCheckmate;
                }

                this.updateMoveCountDisplay();
                this.updateRotationUI();
                
                const posStr = this.getPositionString();
                this.positionHistory.push(posStr);
                
                let isThreefold = false;
                let isFiftyMove = false;
                if (this.positionHistory.filter(p => p === posStr).length >= 3) {
                    isThreefold = true;
                }
                if (this.halfMoveClock >= 100) {
                    isFiftyMove = true;
                }

                if (this.gameMode === 'online' && this.turn !== this.playerColor) {
                    this.sendOnlineMove(isCheckmate, isStalemate, isInsufficient, isThreefold, isFiftyMove);
                }

                if (isCheckmate) {
                    this.isGameOver = true; 
                    sessionStorage.removeItem('chessGameState');
                    this.sfx.checkmate(); 
                    this.stopTimer();
                    const winnerColor = this.turn === 'white' ? 'black' : 'white';
                    this.showWinLoseMessage(window.t('checkmate'), winnerColor);
                    this.showRematchButton();
                } else if (isStalemate) {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.sfx.checkmate(); 
                    this.stopTimer();
                    this.showDrawMessage(window.t('stalemate'));
                    this.showRematchButton();
                } else if (isInsufficient) {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.sfx.checkmate(); 
                    this.stopTimer();
                    this.showDrawMessage(window.t('insufficientMaterial'));
                    this.showRematchButton();
                } else if (isThreefold) {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.sfx.checkmate(); 
                    this.stopTimer();
                    this.showDrawMessage(window.t('threefoldRepetition'));
                    this.showRematchButton();
                } else if (isFiftyMove) {
                    this.isGameOver = true;
                    sessionStorage.removeItem('chessGameState');
                    this.sfx.checkmate(); 
                    this.stopTimer();
                    this.showDrawMessage(window.t('fiftyMoveRule'));
                    this.showRematchButton();
                } else {
                    if (this.inCheckPos) this.sfx.check(); 
                    
                    this.updateLanguageUI();
                    
                    if ((this.gameMode === 'cpu' || this.gameMode === 'cpu_ranked') && this.turn !== this.playerColor) {
                        setTimeout(() => { if (window.game) window.game.cpuMove(); }, 400);
                    } else if (this.gameMode !== 'online' && this.gameMode !== 'cpu_ranked' || this.turn === this.playerColor) {
                        this.updatePageInfoForAssist();
                    }
                }
                this.needsRender = true;
            }

            updatePageInfoForAssist() {
                this.updateAssistMoves();
            }

            isMate() {
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const p = this.board[y][x];
                        if (p && (this.turn === 'white' ? p === p.toUpperCase() : p === p.toLowerCase())) {
                            if (this.getMoves(x, y, this.board).length > 0) return false;
                        }
                    }
                }
                return true;
            }

            isInsufficientMaterial() {
                let whiteBishops = [];
                let blackBishops = [];
                let whiteKnights = 0;
                let blackKnights = 0;

                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const p = this.board[y][x];
                        if (!p) continue;
                        
                        const type = p.toLowerCase();
                        if (type === 'p' || type === 'r' || type === 'q') {
                            return false;
                        }

                        if (p === 'B') whiteBishops.push((x + y) % 2);
                        else if (p === 'b') blackBishops.push((x + y) % 2);
                        else if (p === 'N') whiteKnights++;
                        else if (p === 'n') blackKnights++;
                    }
                }

                if (whiteBishops.length === 0 && blackBishops.length === 0 && whiteKnights === 0 && blackKnights === 0) {
                    return true;
                }

                if (whiteBishops.length + whiteKnights + blackBishops.length + blackKnights === 1) {
                    return true;
                }

                if (whiteBishops.length === 1 && blackBishops.length === 1 && whiteKnights === 0 && blackKnights === 0) {
                    if (whiteBishops[0] === blackBishops[0]) {
                        return true;
                    }
                }

                return false;
            }

            getCpuMoveWeights(numCandidates) {
                const weights = new Array(numCandidates).fill(0);
                const levelRatio = Math.max(0, Math.min(1, (this.aiLevel - 1) / 49));
                
                if (numCandidates === 1) return [1.0];

                if (numCandidates === 2) {
                    weights[0] = 0.60 + 0.35 * levelRatio; 
                    weights[1] = 1.0 - weights[0];
                } else if (numCandidates === 3) {
                    weights[0] = 0.50 + 0.40 * levelRatio; // Lv49で約89.1%の確率で最善手
                    weights[1] = (1.0 - weights[0]) * 0.7; // Lv49で約7.6%の確率で次善手
                    weights[2] = (1.0 - weights[0]) * 0.3; // Lv49で約3.3%の確率で第3候補
                } else if (numCandidates === 4) {
                    weights[0] = 0.40 + 0.45 * levelRatio; 
                    weights[1] = (1.0 - weights[0]) * 0.5;
                    weights[2] = (1.0 - weights[0]) * 0.3;
                    weights[3] = (1.0 - weights[0]) * 0.2;
                } else {
                    weights[0] = 0.30 + 0.50 * levelRatio; 
                    const remaining = 1.0 - weights[0];
                    weights[1] = remaining * 0.4;
                    weights[2] = remaining * 0.3;
                    weights[3] = remaining * 0.2;
                    weights[4] = remaining * 0.1;
                }

                const sum = weights.reduce((a, b) => a + b, 0);
                return weights.map(w => w / sum);
            }

            cpuMove() {
                const allMoves = this.getAllValidMoves(this.turn, this.board, this.enPassantTarget);
                if (allMoves.length === 0) return;

                let blunderChance = 0;
                if (this.aiLevel <= 10) {
                    blunderChance = 0.35 - ((this.aiLevel - 1) * 0.02);
                } else if (this.aiLevel <= 30) {
                    blunderChance = 0.15 - ((this.aiLevel - 10) * 0.004);
                } else if (this.aiLevel <= 45) {
                    blunderChance = 0.04 - ((this.aiLevel - 30) * 0.0025);
                } else {
                    blunderChance = 0;
                }

                if (Math.random() < blunderChance) {
                    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
                    this.startMove(randomMove);
                    return;
                }

                if (this.stockfish && this.aiLevel >= 5) {
                    this.isThinkingForCpu = true;
                    this.isAssistModeThinking = false;
                    this.tempCpuMoves = [];
                    
                    // ELOに応じて上位候補数を自動決定（低ELOほど候補を広げて不安定さを演出）
                    let numCandidates = 1;
                    if (this.aiElo <= 800) numCandidates = 5;
                    else if (this.aiElo <= 1200) numCandidates = 4;
                    else if (this.aiElo <= 1700) numCandidates = 3;
                    else if (this.aiElo <= 2100) numCandidates = 2;
                    else numCandidates = 1;
                    
                    let skillLevel = Math.max(0, Math.min(20, Math.floor((this.aiLevel - 5) * (20 / 30)))); 
                    let depth = Math.max(1, Math.floor(1 + (this.aiLevel / 4)));
                    
                    this.stockfish.postMessage("setoption name MultiPV value " + numCandidates);
                    this.stockfish.postMessage("setoption name Skill Level value " + skillLevel);
                    this.stockfish.postMessage("position fen " + this.getFen());
                    
                    if (this.aiLevel >= 35) {
                        const movetime = (this.aiLevel - 30) * 100; // 高ELOでの思考時間
                        this.stockfish.postMessage("go depth " + depth + " movetime " + movetime);
                    } else {
                        this.stockfish.postMessage("go depth " + depth);
                    }
                } else {
                    this.fallbackCpuMove(allMoves);
                }
            }

            fallbackCpuMove(allMoves) {
                const all = allMoves || this.getAllValidMoves(this.turn, this.board, this.enPassantTarget);
                if (all.length === 0) return;
                
                const depth = this.aiLevel <= 3 ? 1 : 2;

                all.forEach(m => {
                    const tempBoard = this.applyMove(this.board, m);
                    const nextEnPassantTarget = m.isDoublePawn ? { x: m.from.x, y: m.from.y + (this.board[m.from.y][m.from.x] === 'P' ? -1 : 1) } : null;
                    
                    let score = 0;
                    if (depth > 1) {
                        score = this.minimax(tempBoard, depth - 1, -Infinity, Infinity, false, this.turn, nextEnPassantTarget);
                    } else {
                        score = this.evaluateBoardForMinimax(tempBoard, this.turn);
                    }

                    if (m.isCastling) score += 50;
                    if (m.isEnPassant) score += 10;

                    const piece = this.board[m.from.y][m.from.x];
                    const pieceType = piece.toLowerCase();

                    if (pieceType === 'n' || pieceType === 'b' || pieceType === 'p') {
                        if (m.to.x >= 3 && m.to.x <= 4 && m.to.y >= 3 && m.to.y <= 4) score += 6;
                        else if (m.to.x >= 2 && m.to.x <= 5 && m.to.y >= 2 && m.to.y <= 5) score += 3;
                    } else if (pieceType === 'q') {
                        score -= 3; 
                    }

                    const dir = this.turn === 'white' ? -1 : 1;
                    const forwardDist = (m.to.y - m.from.y) * dir;
                    if (forwardDist > 0) {
                        if (pieceType === 'p') score += 2;
                        else score += 0.5; 
                    }
                    
                    const startRow = this.turn === 'white' ? 7 : 0;
                    if (m.from.y === startRow && (pieceType === 'n' || pieceType === 'b')) {
                        score += 1.5;
                    }
                    
                    const noise = (Math.random() - 0.5) * Math.max(0, (10 - this.aiLevel) * 2);
                    m.evalScore = score + noise;
                });

                all.sort((a,b) => b.evalScore - a.evalScore);

                // フォールバック側も候補数を統一
                let numCandidates = 1;
                if (this.aiElo <= 700) numCandidates = 5;
                else if (this.aiElo <= 1100) numCandidates = 4;
                else if (this.aiElo <= 2400) numCandidates = 3;
                else numCandidates = 1;

                numCandidates = Math.min(numCandidates, all.length);
                const weights = this.getCpuMoveWeights(numCandidates);
                const rand = Math.random();
                let sum = 0;
                let selectedIndex = 0;
                for(let i = 0; i < numCandidates; i++) {
                    sum += weights[i];
                    if (rand <= sum) {
                        selectedIndex = i;
                        break;
                    }
                }

                this.startMove(all[selectedIndex]);
            }

            undoMove() {
                if (this.gameMode === 'online' || this.gameMode === 'cpu_ranked') {
                    return; 
                }
                if (this.gameMode === 'cpu' && this.playerColor === 'black' && this.history.length <= 1) {
                    return; 
                }
                if (this.history.length === 0 || this.animatingPiece) return;
                
                const restore = () => {
                    if (this.history.length === 0) return false;
                    const prev = JSON.parse(this.history.pop());
                    this.board = prev.board; 
                    this.timers = prev.timers;
                    this.lastMove = prev.lastMove;
                    this.movedStatus = prev.movedStatus;
                    this.enPassantTarget = prev.enPassantTarget ? { ...prev.enPassantTarget } : null;
                    this.halfMoveClock = prev.halfMoveClock;
                    this.positionHistory = prev.positionHistory;
                    this.moveCount = prev.moveCount || 0;
                    this.firstMoveDone = prev.firstMoveDone || { white: false, black: false };
                    this.turn = prev.turn !== undefined ? prev.turn : (this.turn === 'white' ? 'black' : 'white');
                    return true;
                };

                restore();
                if (this.gameMode === 'cpu' && this.turn !== this.playerColor) {
                    restore();
                }

                this.selected = null;
                this.animatingPiece = null;
                this.draggingPiece = null;
                this.pendingPromotion = null;
                this.isGameOver = false;
                this.isThinkingForCpu = false;
                this.isAssistModeThinking = false;
                if (this.stockfish) {
                    this.stockfish.postMessage("stop");
                }
                document.getElementById('promotion-modal').style.display = 'none';
                document.getElementById('rematch-btn').style.display = 'none';
                
                this.turnStartTime = Date.now();
                this.baseTimers = { ...this.timers };
                
                this.updateCheckStatus();
                if (this.useTimer) this.startTimer();
                const checkStr = this.inCheckPos ? window.t('checkWarning') : "";
                this.showTurnMessage(checkStr);
                this.updateTimerDisplay();
                this.updateAdvantageMeter();
                this.updateMoveCountDisplay();
                this.updateRotationUI();
                this.updateAssistMoves();
                this.needsRender = true;
                this.saveGameState();
            }

            isSquareAttacked(x, y, color, board) {
                const opponentColor = color === 'white' ? 'black' : 'white';
                const opponentPawn = opponentColor === 'white' ? 'P' : 'p';
                const opponentKnight = opponentColor === 'white' ? 'N' : 'n';
                const opponentBishop = opponentColor === 'white' ? 'B' : 'b';
                const opponentRook = opponentColor === 'white' ? 'R' : 'r';
                const opponentQueen = opponentColor === 'white' ? 'Q' : 'q';
                const opponentKing = opponentColor === 'white' ? 'K' : 'k';
                const pawnDir = opponentColor === 'white' ? 1 : -1;

                const checkPawn = (dx) => {
                    const nx = x + dx;
                    const ny = y + pawnDir;
                    return nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === opponentPawn;
                };

                if (checkPawn(-1) || checkPawn(1)) return true;

                const knightOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
                for (const [dy,dx] of knightOffsets) {
                    const ny = y + dy;
                    const nx = x + dx;
                    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === opponentKnight) return true;
                }

                const directions = [
                    [0,1],[0,-1],[1,0],[-1,0],
                    [1,1],[1,-1],[-1,1],[-1,-1]
                ];
                for (const [dy,dx] of directions) {
                    let ny = y + dy;
                    let nx = x + dx;
                    let distance = 1;
                    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                        const piece = board[ny][nx];
                        if (piece) {
                            if ((opponentColor === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
                                if (distance === 1 && piece === opponentKing) return true;
                                if ((dy === 0 || dx === 0) && (piece === opponentRook || piece === opponentQueen)) return true;
                                if ((dy !== 0 && dx !== 0) && (piece === opponentBishop || piece === opponentQueen)) return true;
                            }
                            break;
                        }
                        ny += dy;
                        nx += dx;
                        distance += 1;
                    }
                }

                return false;
            }

            isInCheck(color, board) {
                const kingChar = color === 'white' ? 'K' : 'k';
                let kingPos = null;
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        if (board[y][x] === kingChar) kingPos = { x, y };
                    }
                }
                if (!kingPos) return false;
                return this.isSquareAttacked(kingPos.x, kingPos.y, color, board);
            }

            getMoves(x, y, b, ignoreCheck = false, epTarget = this.enPassantTarget) {
                const p = b[y][x]; if (!p) return [];
                const type = p.toLowerCase(), moves = [], dir = p === 'P' ? -1 : 1;
                const isOwn = piece => (p === p.toUpperCase()) === (piece === piece.toUpperCase());
                const color = p === p.toUpperCase() ? 'white' : 'black';
                
                if (type === 'p') {
                    if (y+dir>=0 && y+dir<8 && !b[y+dir][x]) {
                        moves.push({from:{x,y}, to:{x,y:y+dir}});
                        if (y===(p==='P'?6:1) && !b[y+dir*2][x]) moves.push({from:{x,y}, to:{x:x, y:y+dir*2}, isDoublePawn: true});
                    }
                    [-1,1].forEach(dx => {
                        const nx = x+dx, ny = y+dir;
                        if (nx>=0 && nx<8 && ny>=0 && ny<8) {
                            if (b[ny][nx] && !isOwn(b[ny][nx])) {
                                moves.push({from:{x,y}, to:{x:nx,y:ny}});
                            } else if (epTarget && epTarget.x === nx && epTarget.y === ny) {
                                moves.push({from:{x,y}, to:{x:nx,y:ny}, isEnPassant: true});
                            }
                        }
                    });
                } else if (type === 'n') {
                    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dy,dx])=>{
                        const nx=x+dx, ny=y+dy;
                        if (nx>=0 && nx<8 && ny>=0 && ny<8 && (!b[ny][nx] || !isOwn(b[ny][nx]))) moves.push({from:{x,y}, to:{x:nx,y:ny}});
                    });
                } else {
                    const ds = [];
                    if (type==='r'||type==='q') ds.push([0,1],[0,-1],[1,0],[-1,0]);
                    if (type==='b'||type==='q') ds.push([1,1],[1,-1],[-1,1],[-1,-1]);
                    if (type==='k') ds.push([0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]);
                    ds.forEach(([dy,dx]) => {
                        let nx=x+dx, ny=y+dy;
                        while(nx>=0 && nx<8 && ny>=0 && ny<8) {
                            if (!b[ny][nx]) { moves.push({from:{x,y}, to:{x:nx,y:ny}}); if(type==='k') break; }
                            else { if (!isOwn(b[ny][nx])) moves.push({from:{x,y}, to:{x:nx,y:ny}}); break; }
                            nx+=dx; ny+=dy;
                        }
                    });

                    // 修正: キングが現在チェック状態にある（isInCheck）ならキャスリングを禁止
                    if (type === 'k' && !ignoreCheck) {
                        const kingMoved = color === 'white' ? this.movedStatus.whiteKing : this.movedStatus.blackKing;
                        const rookChar = color === 'white' ? 'R' : 'r';
                        const canCastle = !kingMoved && !this.isInCheck(color, b) && !this.kingHasBeenInCheck[color];
                        if (canCastle) {
                            const rightRookMoved = color === 'white' ? this.movedStatus.whiteRookRight : this.movedStatus.blackRookRight;
                            if (!rightRookMoved && b[y][7] === rookChar && !b[y][5] && !b[y][6]) {
                                if (!this.isSquareAttacked(5, y, color, b) && !this.isSquareAttacked(6, y, color, b)) {
                                    moves.push({from:{x,y}, to:{x:6, y}, isCastling: true});
                                }
                            }
                            const leftRookMoved = color === 'white' ? this.movedStatus.whiteRookLeft : this.movedStatus.blackRookLeft;
                            if (!leftRookMoved && b[y][0] === rookChar && !b[y][1] && !b[y][2] && !b[y][3]) {
                                if (!this.isSquareAttacked(3, y, color, b) && !this.isSquareAttacked(2, y, color, b)) {
                                    moves.push({from:{x,y}, to:{x:2, y}, isCastling: true});
                                }
                            }
                        }
                    }
                }

                if (ignoreCheck) return moves;

                return moves.filter(m => {
                    const t = b.map(r=>[...r]); 
                    t[m.to.y][m.to.x] = t[m.from.y][m.from.x]; 
                    t[m.from.y][m.from.x] = null;
                    if (m.isEnPassant) {
                        const epDir = p === 'P' ? 1 : -1;
                        t[m.to.y + epDir][m.to.x] = null;
                    }
                    if (m.isCastling) {
                        const rookFromX = m.to.x === 6 ? 7 : 0;
                        const rookToX = m.to.x === 6 ? 5 : 3;
                        t[m.to.y][rookToX] = t[m.to.y][rookFromX];
                        t[m.to.y][rookFromX] = null;
                    }
                    const king = (color === 'white' ? 'K' : 'k'); 
                    let kp;
                    for (let ry=0; ry<8; ry++) for (let rx=0; rx<8; rx++) if (t[ry][rx] === king) kp = {x:rx, y:ry};
                    if (!kp) return false;
                    return !this.isSquareAttacked(kp.x, kp.y, color, t);
                });
            }

            updateStatus(s) { 
                document.getElementById('game-status').innerText = s; 
                
                if (this.isGameOver) {
                    this.clearActiveStyles();
                    return;
                }

                if (this.gameMode === 'pvp' || this.gameMode === 'online') {
                    const bottomLabel = document.getElementById('bottom-player-label');
                    const topLabel = document.getElementById('top-player-label');
                    
                    let isBottomActive = false;
                    if (this.gameMode === 'online') {
                        isBottomActive = this.turn === this.playerColor;
                    } else {
                        isBottomActive = this.turn === 'white';
                    }

                    if (isBottomActive) {
                        if (bottomLabel) { bottomLabel.classList.add('text-blue-400'); bottomLabel.classList.remove('opacity-70'); }
                        if (topLabel) { topLabel.classList.remove('text-blue-400'); topLabel.classList.add('opacity-70'); }
                    } else {
                        if (topLabel) { topLabel.classList.add('text-blue-400'); topLabel.classList.remove('opacity-70'); }
                        if (bottomLabel) { bottomLabel.classList.remove('text-blue-400'); bottomLabel.classList.add('opacity-70'); }
                    }
                }
            }

            animate() {
                if (this.initialized && (this.needsRender || this.animatingPiece || this.draggingPiece)) {
                    this.needsRender = false;
                    this.render();
                }
                requestAnimationFrame(() => this.animate());
            }

            render() {
                if (!this.initialized) return;
                this.ctx.clearRect(0,0,SIZE,SIZE);
                for (let y=0; y<8; y++) for (let x=0; x<8; x++) {
                    const {x:sx, y:sy} = (this.playerColor === 'black' ? {x:7-x, y:7-y} : {x,y});
                    this.ctx.fillStyle = (x+y)%2===0 ? COLORS.light : COLORS.dark;
                    this.ctx.fillRect(sx*CELL, sy*CELL, CELL, CELL);
                    
                    if (this.lastMove && ((this.lastMove.from.x === x && this.lastMove.from.y === y) || (this.lastMove.to.x === x && this.lastMove.to.y === y))) {
                        this.ctx.fillStyle = COLORS.lastMove; this.ctx.fillRect(sx*CELL, sy*CELL, CELL, CELL);
                    }
                    
                    if (this.selected && this.selected.x === x && this.selected.y === y) {
                        this.ctx.fillStyle = COLORS.selected; this.ctx.fillRect(sx*CELL, sy*CELL, CELL, CELL);
                    }
                    
                    if (this.inCheckPos && this.inCheckPos.x === x && this.inCheckPos.y === y) {
                        this.ctx.fillStyle = 'rgba(255, 50, 50, 0.7)';
                        this.ctx.fillRect(sx*CELL, sy*CELL, CELL, CELL);
                    }

                    if (this.boardCursor && this.boardCursor.x === x && this.boardCursor.y === y) {
                        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.95)';
                        this.ctx.lineWidth = 4;
                        this.ctx.strokeRect(sx*CELL + 2, sy*CELL + 2, CELL - 4, CELL - 4);
                    }
                }

                if (this.selected) {
                    this.validMoves.forEach(m => {
                        const {x:sx, y:sy} = (this.playerColor === 'black' ? {x:7-m.to.x, y:7-m.to.y} : {x:m.to.x, y:m.to.y});
                        const targetPiece = this.board[m.to.y][m.to.x];
                        
                        if (targetPiece || m.isEnPassant) {
                            this.ctx.beginPath();
                            this.ctx.arc(sx*CELL+CELL/2, sy*CELL+CELL/2, CELL/2.2, 0, Math.PI*2);
                            this.ctx.strokeStyle = COLORS.captureRing;
                            this.ctx.lineWidth = 4;
                            this.ctx.stroke();
                        } else {
                            this.ctx.beginPath(); 
                            this.ctx.arc(sx*CELL+CELL/2, sy*CELL+CELL/2, CELL/7, 0, Math.PI*2);
                            this.ctx.fillStyle = COLORS.validDot; 
                            this.ctx.fill();
                        }
                    });
                }

                this.ctx.font = `${CELL*0.85}px "Helvetica Neue", "Arial Unicode MS", Arial, sans-serif`; 
                this.ctx.textBaseline='middle';
                this.ctx.lineJoin = 'round';
                
                for (let y=0; y<8; y++) for (let x=0; x<8; x++) {
                    const p = this.board[y][x];
                    if (p) { 
                        if (this.draggingPiece && this.draggingPiece.fromX === x && this.draggingPiece.fromY === y) continue;

                        const {x:sx, y:sy} = (this.playerColor === 'black' ? {x:7-x, y:7-y} : {x,y}); 
                        const shouldRotatePiece = (this.gameMode === 'pvp' && this.autoRotate && this.turn === 'black');
                        
                        if (shouldRotatePiece) {
                            this.ctx.save();
                            this.ctx.translate(sx*CELL+CELL/2, sy*CELL+CELL/2+5);
                            this.ctx.rotate(Math.PI);
                            this.drawPieceAtZero(p);
                            this.ctx.restore();
                        } else {
                            this.drawPiece(p, sx*CELL+CELL/2, sy*CELL+CELL/2+5); 
                        }
                    }
                }

                if (this.isAssistMode && this.assistMoves.length > 0 && !this.animatingPiece && !this.isGameOver) {
                    if (this.gameMode === 'pvp' || this.turn === this.playerColor) {
                        this.assistMoves.forEach((m, idx) => {
                            if (!m) return;
                            const color = idx === 0 ? 'rgba(50, 255, 50, 0.7)' : 'rgba(255, 200, 50, 0.6)';
                            const f = this.playerColor === 'black' ? {x:7-m.from.x, y:7-m.from.y} : m.from;
                            const t = this.playerColor === 'black' ? {x:7-m.to.x, y:7-m.to.y} : m.to;
                            const fromX = f.x*CELL + CELL/2;
                            const fromY = f.y*CELL + CELL/2;
                            const toX = t.x*CELL + CELL/2;
                            const toY = t.y*CELL + CELL/2;
                            
                            this.ctx.strokeStyle = color;
                            this.ctx.lineWidth = 4;
                            this.ctx.lineCap = 'round';
                            
                            this.ctx.beginPath();
                            this.ctx.moveTo(fromX, fromY);
                            this.ctx.lineTo(toX, toY);
                            this.ctx.stroke();
                            
                            const angle = Math.atan2(toY - fromY, toX - fromX);
                            const headlen = CELL * 0.25;
                            
                            this.ctx.beginPath();
                            this.ctx.moveTo(toX, toY);
                            this.ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
                            this.ctx.moveTo(toX, toY);
                            this.ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
                            this.ctx.stroke();
                        });
                    }
                }

                if (this.draggingPiece) {
                    const p = this.draggingPiece.piece;
                    const shouldRotatePiece = (this.gameMode === 'pvp' && this.autoRotate && this.turn === 'black');
                    this.ctx.globalAlpha = 0.8;
                    this.ctx.save();
                    this.ctx.translate(this.draggingPiece.currentX, this.draggingPiece.currentY + 5);
                    this.ctx.scale(1.2, 1.2);
                    if (shouldRotatePiece) {
                        this.ctx.rotate(Math.PI);
                    }
                    this.drawPieceAtZero(p);
                    this.ctx.restore();
                    this.ctx.globalAlpha = 1.0;
                }

                if (this.animatingPiece) {
                    const a = this.animatingPiece; a.progress += 0.15;
                    if (a.progress >= 1) { 
                        if (a.isOpponent) {
                            this.board = a.targetBoard;
                            this.updateCheckStatus();
                            this.updateAdvantageMeter();
                            
                            if (a.isCapture) {
                                this.sfx.pieceCapture();
                            } else {
                                this.sfx.pieceMove();
                            }
                            
                            if (this.inCheckPos) this.sfx.check();
                            
                            this.animatingPiece = null;
                            this.checkGameEnd(a.data, a.data.gameState, a.oldTurn, a.newTurn);
                        } else {
                            this.executeMove(a.move); 
                        }
                        this.needsRender = true;
                    }
                    else {
                        const f = (this.playerColor === 'black' ? {x:7-a.from.x, y:7-a.from.y} : a.from);
                        const t = (this.playerColor === 'black' ? {x:7-a.to.x, y:7-a.to.y} : a.to);
                        const cx = f.x + (t.x-f.x)*a.progress, cy = f.y + (t.y-f.y)*a.progress;
                        
                        const shouldRotatePiece = (this.gameMode === 'pvp' && this.autoRotate && this.turn === 'black');

                        if (shouldRotatePiece) {
                            this.ctx.save();
                            this.ctx.translate(cx*CELL+CELL/2, cy*CELL+CELL/2+5);
                            this.ctx.rotate(Math.PI);
                            this.drawPieceAtZero(a.piece);
                            this.ctx.restore();
                        } else {
                            this.drawPiece(a.piece, cx*CELL+CELL/2, cy*CELL+CELL/2+5);
                        }
                    }
                }
            }

            drawPiece(piece, px, py) {
                const isWhite = piece === piece.toUpperCase();
                const text = PIECES[piece];
                this.ctx.textAlign = 'left';
                const metrics = this.ctx.measureText(text);
                const width = metrics.width;
                const adjustX = px - width / 2;

                this.ctx.lineWidth = 3;
                this.ctx.strokeStyle = isWhite ? '#000000' : 'rgba(255, 255, 255, 0.4)';
                this.ctx.strokeText(text, adjustX, py);
                this.ctx.fillStyle = isWhite ? '#ffffff' : '#000000';
                this.ctx.fillText(text, adjustX, py);
            }
            
            drawPieceAtZero(piece) {
                const isWhite = piece === piece.toUpperCase();
                const text = PIECES[piece];
                this.ctx.textAlign = 'left';
                const metrics = this.ctx.measureText(text);
                const width = metrics.width;
                const adjustX = -width / 2;

                this.ctx.lineWidth = 3;
                this.ctx.strokeStyle = isWhite ? '#000000' : 'rgba(255, 255, 255, 0.4)';
                this.ctx.strokeText(text, adjustX, 0);
                this.ctx.fillStyle = isWhite ? '#ffffff' : '#000000';
                this.ctx.fillText(text, adjustX, 0);
            }
        }
        
        window.game = new ChessGame('chessBoard');

        let authObserverReady = false;
        let authBootstrapPending = false;
        let emailLinkSignInPending = false;
        let emailLinkRegistrationPending = false;
        let emailLinkRegistrationEmail = '';

        const initAuth = async () => {
            try {
                if (auth) {
                    await setPersistence(auth, browserLocalPersistence);
                }
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                }
            } catch(e) { console.error(e); }
        };

        const maybeCompleteEmailLinkSignIn = async () => {
            if (!auth || !isSignInWithEmailLink(window.location.href)) return false;
            emailLinkSignInPending = true;
            try {
                const savedEmail = localStorage.getItem(EMAIL_LINK_STORAGE_KEY) || window.prompt('確認メールを送ったEメールアドレスを入力してください');
                if (!savedEmail) return false;
                emailLinkRegistrationEmail = savedEmail.trim();
                await signInWithEmailLink(auth, savedEmail.trim(), window.location.href);
                emailLinkRegistrationPending = true;
                localStorage.removeItem(EMAIL_LINK_STORAGE_KEY);
                try {
                    window.history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}`);
                } catch (e) {}
                return true;
            } catch (e) {
                console.error('Email link sign-in failed:', e);
                alert('メールリンク認証に失敗しました: ' + (e?.message || e));
                return false;
            } finally {
                emailLinkSignInPending = false;
            }
        };

        if (auth) {
            onAuthStateChanged(auth, user => { 
                if (!authObserverReady) {
                    authObserverReady = true;
                    if (!user && !authBootstrapPending && !emailLinkSignInPending && typeof __initial_auth_token === 'undefined') {
                        authBootstrapPending = true;
                        signInAnonymously(auth).catch(console.error);
                    }
                }

                if (user) {
                    window.game.userId = user.uid;
                    window.game.isLoggedIn = !user.isAnonymous;
                    if (window.game.isLoggedIn) {
                        if (emailLinkRegistrationPending) {
                            window.game.playerProfile = null;
                            window.game.updateProfileUI();
                            document.getElementById('auth-status').innerText = window.t('authRegistrationPending');
                            window.game.openEmailLinkRegistrationModal(emailLinkRegistrationEmail || user.email || '');
                        } else {
                            window.game.loadProfile(); // 認証後にプロフィールをロード
                            document.getElementById('auth-status').innerText = window.t('authStatusReady');
                        }
                    } else {
                        window.game.playerProfile = null;
                        window.game.updateProfileUI();
                        document.getElementById('auth-status').innerText = window.t('authStatusPreparing');
                    }
                } else {
                    emailLinkRegistrationPending = false;
                    emailLinkRegistrationEmail = '';
                    window.game.isLoggedIn = false;
                    window.game.playerProfile = null;
                    window.game.updateProfileUI();
                    document.getElementById('auth-status').innerText = window.t('authStatusPreparing');
                }

                // 更新された認証状態に基づき UI を切り替え
                updateAuthControls(user);
                window.game.updateAuthDependentUI();

                // セッション復帰の処理（保存された online ルーム情報がある場合）
                const savedRoomId = localStorage.getItem('chessRoomId');
                const savedUserId = localStorage.getItem('chessUserId');
                const savedIsHost = localStorage.getItem('chessIsHost');
                const savedMode = localStorage.getItem('chessGameMode');
                if (savedRoomId && savedUserId && savedMode === 'online' && user) {
                    window.game.userId = savedUserId;
                    window.game.roomId = savedRoomId;
                    window.game.isHost = savedIsHost === 'true';
                    window.game.gameMode = 'online';
                    
                    document.getElementById('mode-selection').style.display = 'none';
                    window.game.updateStatus(window.t('reconnecting'));
                    
                    window.game.startHeartbeat();
                    window.game.listenToRoom();
                }
            });

            maybeCompleteEmailLinkSignIn().finally(() => {
                initAuth();
            });

            // Auth 関連の UI ロジック：プロバイダ選択 / サインアウト
            
            const authBtn = document.getElementById('auth-signin-btn');

            const updateAuthControls = (user) => {
                const btn = document.getElementById('auth-signin-btn');
                const authModal = document.getElementById('auth-modal');
                const settingsBtn = document.getElementById('settings-btn');
                const status = document.getElementById('auth-status');
                if (!btn || !status) return;
                status.style.display = 'block';
                
                const isSignedIn = !!user && !user.isAnonymous;
                const needsRegistration = isSignedIn && emailLinkRegistrationPending;

                if (isSignedIn) {
                    btn.style.display = 'none';
                    if (authModal) authModal.style.display = 'none';
                    if (settingsBtn) settingsBtn.style.display = needsRegistration ? 'none' : 'inline-block';
                    status.innerText = needsRegistration ? window.t('authRegistrationPending') : window.t('authStatusReady');
                } else {
                    btn.style.display = 'inline-block';
                    if (settingsBtn) settingsBtn.style.display = 'none';
                    status.innerText = window.t('authStatusPreparing');
                }
            };

            const getSelectedAuthProvider = (providerKey) => {
                switch (providerKey) {
                    case 'email':
                        return 'email';
                    case 'apple':
                        return appleProvider;
                    case 'facebook':
                        return facebookProvider;
                    case 'github':
                        return githubProvider;
                    case 'google':
                    default:
                        return googleProvider;
                }
            };

            const handleEmailSignup = async () => {
                const emailInput = document.getElementById('auth-signup-email');
                const email = (emailInput?.value || '').trim();
                if (!email) {
                    alert('Eメールアドレスを入力してください');
                    return;
                }
                try {
                    const continueUrl = getEmailLinkContinueUrl();
                    const actionCodeSettings = {
                        url: continueUrl,
                        handleCodeInApp: true
                    };
                    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
                    localStorage.setItem(EMAIL_LINK_STORAGE_KEY, email);
                    alert(window.t('authEmailLinkSent'));
                } catch (e) {
                    if (e?.code === 'auth/invalid-email') {
                        alert('メールアドレスが正しくありません');
                        return;
                    }
                    console.error('Email sign-in error:', e);
                    throw e;
                }
            };

            const handleEmailPasswordLogin = async () => {
                const emailInput = document.getElementById('auth-login-email');
                const passwordInput = document.getElementById('auth-login-password');
                const email = (emailInput?.value || '').trim();
                const password = passwordInput?.value || '';
                if (!email || !password) {
                    alert('Eメールアドレスとパスワードを入力してください');
                    return;
                }
                await signInWithEmailAndPassword(auth, email, password);
            };

            const handleAuthProviderButton = async (providerKey) => {
                const provider = getSelectedAuthProvider(providerKey);
                if (provider === 'email') {
                    await handleEmailSignup();
                    return;
                }
                await signInWithPopup(auth, provider);
            };

            const authOpenBtn = document.getElementById('auth-signin-btn');
            const authCloseBtn = document.getElementById('auth-modal-close-btn');
            const emailSignupBtn = document.getElementById('auth-email-signup-btn');
            const emailLoginBtn = document.getElementById('auth-email-login-btn');
            const providerButtons = Array.from(document.querySelectorAll('#auth-modal [data-provider]'));

            if (authOpenBtn) {
                authOpenBtn.addEventListener('click', () => {
                    const modal = document.getElementById('auth-modal');
                    if (!modal) return;
                    modal.style.display = 'flex';
                    setTimeout(() => document.getElementById('auth-signup-email')?.focus(), 0);
                });
            }

            if (authCloseBtn) {
                authCloseBtn.addEventListener('click', () => {
                    const modal = document.getElementById('auth-modal');
                    if (modal) modal.style.display = 'none';
                });
            }

            if (emailSignupBtn) {
                emailSignupBtn.addEventListener('click', async () => {
                    await handleEmailSignup();
                });
            }

            if (emailLoginBtn) {
                emailLoginBtn.addEventListener('click', async () => {
                    await handleEmailPasswordLogin();
                });
            }

            providerButtons.forEach((button) => {
                button.addEventListener('click', async () => {
                    const providerKey = button.getAttribute('data-provider');
                    if (!providerKey) return;
                    try {
                        await handleAuthProviderButton(providerKey);
                    } catch (e) {
                        console.error('Sign-in error:', e.code, e.message);
                        alert('ログインに失敗しました: ' + (e.message || 'Unknown error'));
                    }
                });
            });

            const handleAuthButtonClick = async (e) => {
                if (!auth) {
                    console.error('Firebase Auth not initialized');
                    return;
                }
                const modal = document.getElementById('auth-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    setTimeout(() => document.getElementById('auth-signup-email')?.focus(), 0);
                }
            };

            if (authBtn) {
                authBtn.addEventListener('click', handleAuthButtonClick);
            }
        }

        window.addEventListener('online', () => {
            if (window.game && window.game.gameMode === 'online' && window.game.roomId && window.game.userId) {
                const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', window.game.roomId);
                updateDoc(roomRef, {
                    [`lastSeen.${window.game.userId}`]: Date.now(),
                    'gameState.disconnected': null,
                    'gameState.disconnectedAt': null
                }).catch(()=>{});
                window.game.startHeartbeat();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (window.game && window.game.sfx && window.game.sfx.ctx.state === 'suspended') {
                    window.game.sfx.ctx.resume();
                }
                if (window.game && window.game.gameMode === 'online' && window.game.roomId && window.game.userId && !window.game.isGameOver) {
                    if (window.game.currentRoomData && window.game.currentRoomData.status === 'playing') {
                        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', window.game.roomId);
                        updateDoc(roomRef, {
                            'gameState.disconnected': null,
                            'gameState.disconnectedAt': null
                        }).catch(()=>{});
                    }
                }
            } else if (document.visibilityState === 'hidden') {
                if (window.game && window.game.gameMode === 'online' && window.game.roomId && window.game.userId && !window.game.isGameOver) {
                    if (window.game.currentRoomData && window.game.currentRoomData.status === 'playing') {
                        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', window.game.roomId);
                        updateDoc(roomRef, {
                            'gameState.disconnected': window.game.userId,
                            'gameState.disconnectedAt': Date.now()
                        }).catch(()=>{});
                    }
                }
            }
        });

        window.addEventListener('pagehide', () => {
            if (window.game && window.game.gameMode === 'online' && window.game.roomId && window.game.userId) {
                if (window.game.currentRoomData && window.game.currentRoomData.status === 'waiting' && window.game.isHost) {
                    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', window.game.roomId);
                    deleteDoc(roomRef).catch(()=>{});
                } else if (window.game.currentRoomData && window.game.currentRoomData.status === 'playing' && !window.game.isGameOver) {
                    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'chess_rooms', window.game.roomId);
                    updateDoc(roomRef, {
                        'gameState.disconnected': window.game.userId,
                        'gameState.disconnectedAt': Date.now()
                    }).catch(()=>{});
                }
            }
        });

        window.addEventListener('beforeunload', (e) => {
            if (window.game && window.game.gameMode && !window.game.isGameOver && window.game.initialized) {
                e.preventDefault();
                e.returnValue = window.t('confirmExitMsg'); 
                return window.t('confirmExitMsg');
            }
        });

        window.addEventListener('popstate', (e) => {
            if (window.game && window.game.gameMode === 'online' && !window.game.isGameOver && window.game.initialized) {
                history.pushState({ playing: true }, '', location.href);
                window.game.confirmExit();
            }
        });

    
