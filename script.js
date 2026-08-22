// ==========================================================================
// ❤️ PERSONALIZE YOUR WEBSITE HERE ❤️
// ==========================================================================

const loveConfig = {
    girlfriendName: "Bini",
    boyfriendName: "Bapu",

    // The romantic subtitle quote in the Hero section
    birthdayMessage: "To the girl who makes my world brighter simply by being in it... Happy Birthday,MOTOSHH !! ❤️",

    // Heartbeat section - when she taps the heart
    heartbeatMessage: "You will always have a special place in my heart, Bini. It Is only for you. ❤️",

    // The secret letter typing surprise
    secretSurpriseMessage: "If I had to choose one person to make memories with again and again, in every lifetime, I would still choose you. You are my home, my peace, and my greatest adventure. Happy Birthday subi ! ❤️✨",


    // Song Info (Replace music/apna-bana-le.mp3 with your actual file)
    songTitle: "Our Beautiful Song",
    songArtist: "For Bini",

    // Gallery Photo Captions (Corresponds to photo1.jpg to photo6.jpg)
    photos: [
        { url: "images/photo1.jpg", caption: "Be the reason of own happiness ❤️ " },
        { url: "images/photo2.jpg", caption: "Every moment with you is a favorite memory 🥰" },
        { url: "images/photo3.jpg", caption: "Your smile makes every day a new chance to find happiness ☀️" },
        { url: "images/photo4.jpg", caption: "Under blue skies or dark nights, I'm always happiest next to you 🌎" },
        { url: "images/photo5.jpg", caption: "Those beautiful eyes hold my entire world inside them ✨" },
        { url: "images/photo6.jpg", caption: "Just you being you. The most beautiful person I know ❤️" }
    ],

    // Why I Love You Cards (Icon, Title, Description)
    reasonsWhyILoveYou: [
        { icon: "✨ !!", text: "Your beautiful smile" },
        { icon: "💖 !!", text: "Your kind and warm heart" },
        { icon: "🌸 !!", text: "The incredible way you care" },
        { icon: "🌟 !!", text: "The happiness you bring into my life" },
        { icon: "🧸 !!", text: "All the sweet little things you do" },
        { icon: "💫 !!", text: "Making ordinary days feel magical" },
        { icon: "🥰 !!", text: "Your playful, beautiful personality" },
        { icon: "🌹 !!", text: "Simply because you are Bini" }
    ],

    // Love Story Timeline
    timeline: [
        {
            date: "November 2023",
            title: "Our Quiet Beginning",
            desc: "The day our story quietly started. Every day since has been brighter."
        },
        {
            date: "December 2023",
            title: "Making It Special",
            desc: "A moment I'll always carry in my heart. The connection we shared grew stronger."
        },
        {
            date: "The First Big Laugh",
            title: "Knowing You Were The One",
            desc: "When I realized just how uniquely special you are, and how much your laughter matters."
        },
        {
            date: "A Beautiful Day Out",
            title: "A Memory I'd Replay Forever",
            desc: "One of those perfect days where time stood still, and it was just us."
        },
        {
            date: "Today & Always",
            title: "Still Choosing You",
            desc: "Celebrating you today, still loving you, and choosing you with all of my heart."
        },
        {
            date: "Our Future",
            title: "Countless Memories Awaiting Us",
            desc: "To all the dreams we'll chase, the places we'll go, and the beautiful chapters still unwritten."
        }
    ],

    // Wishes Cards
    wishes: [
        "✨ May you always be happy.",
        "✨ May you achieve every dream you chase.",
        "✨ May success follow you everywhere.",
        "✨ May you always stay healthy and strong.",
        "✨ May your beautiful smile never fade.",
        "✨ May life give you countless reasons to laugh.",
        "✨ May you always feel loved and deeply appreciated.",
        "✨ May every new chapter be better than the last.",
        "✨ And may we write many more beautiful stories together. ❤️"
    ]
};

// ==========================================================================
// CODE IMPLEMENTATION - HANDLERS, ANIMATIONS & INTERACTIVE LOGIC
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // Inject Dynamic Personalization Content
    initializePersonalization();

    // Elements Setup
    const openingScreen = document.getElementById("opening-screen");
    const mainContent = document.getElementById("main-content");
    const navBar = document.querySelector(".nav-bar");
    const audio = document.getElementById("love-song");
    const musicPlayer = document.getElementById("music-player");

    const candle = document.querySelector(".candle");
    const flame = document.getElementById("candle-flame");
    const actionTitle = document.getElementById("opening-action-title");

    let isSurpriseOpened = false;
    let encouragementTimer;

    // --------------------------------------------------
    // 1. CINEMATIC SURPRISE REVEAL (Opening Flow - Blow Out Candle)
    // --------------------------------------------------
    const blowOutCandle = () => {
        if (isSurpriseOpened) return;
        isSurpriseOpened = true;

        clearTimeout(encouragementTimer);

        // 1. Extinguish the flame
        flame.classList.add("blown-out");
        actionTitle.textContent = "Your wish is made! ❤️";

        // 2. Play audio loop
        playLoveSong();

        // 3. Spawn rising smoke particles
        const candleRect = candle.getBoundingClientRect();
        const wickX = candleRect.left + candleRect.width / 2;
        const wickY = candleRect.top + 20;

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                createSmoke(wickX, wickY);
            }, i * 150);
        }

        // 4. Delay site entrance for cinematic timing
        setTimeout(() => {
            openingScreen.classList.add("fade-out");
            mainContent.classList.remove("hidden");
            if (musicPlayer) {
                musicPlayer.classList.remove("hidden");
            }

            setTimeout(() => {
                navBar.classList.add("visible");
                window.dispatchEvent(new Event('scroll'));
            }, 800);

            triggerConfetti(55);
        }, 1300);
    };

    function createSmoke(x, y) {
        const s = document.createElement("div");
        s.className = "smoke";
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1600);
    }

    const playLoveSong = () => {
        if (audio.dataset.failed !== "true") {
            audio.play().then(() => {
                updatePlayPauseButton(true);
            }).catch(err => {
                console.log("Autoplay blocked. Retrying on next gesture.");
            });
        }
    };

    // Auto-play trigger on any initial click on page
    document.addEventListener("click", () => {
        if (audio.paused && audio.dataset.failed !== "true" && isSurpriseOpened) {
            playLoveSong();
        }
    }, { once: true });

    document.addEventListener("touchstart", () => {
        if (audio.paused && audio.dataset.failed !== "true" && isSurpriseOpened) {
            playLoveSong();
        }
    }, { once: true });

    if (candle) {
        // Always enable tap/touch fallback from the start so she can always proceed
        candle.addEventListener("click", blowOutCandle);
        candle.addEventListener("touchstart", blowOutCandle);
        initMicrophoneBlowDetection();
    }

    // Fallback: click/tap anywhere on the opening screen to blow the candle and open
    if (openingScreen) {
        openingScreen.addEventListener("click", blowOutCandle);
        openingScreen.addEventListener("touchstart", blowOutCandle);
    }

    function initMicrophoneBlowDetection() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log("Microphone API not supported. Fallback to tap active.");
            actionTitle.innerHTML = "Tap the flame to blow it out & make a wish... 🕯️✨";
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                // Update instruction text to guide her to blow, mentioning tap fallback
                actionTitle.innerHTML = "Blow into your mic to blow out the candle or tap the flame... 🕯️💨";

                // Show encouragement instruction if blowing doesn't succeed in 6 seconds
                encouragementTimer = setTimeout(() => {
                    if (!isSurpriseOpened) {
                        actionTitle.innerHTML = "Try blowing a bit harder, or just tap the flame to blow it out! 🕯️✨";
                    }
                }, 6000);

                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const mediaStream = audioContext.createMediaStreamSource(stream);

                analyser.fftSize = 512;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                mediaStream.connect(analyser);

                // Auto-resume AudioContext on user interaction to fix mobile browser suspension
                const resumeAudioContext = () => {
                    if (audioContext.state === "suspended") {
                        audioContext.resume();
                    }
                };
                document.addEventListener("click", resumeAudioContext, { passive: true });
                document.addEventListener("touchstart", resumeAudioContext, { passive: true });

                const detectBlow = () => {
                    if (isSurpriseOpened) {
                        // Close stream and context to release microphone and clean up listeners
                        stream.getTracks().forEach(track => track.stop());
                        audioContext.close();
                        document.removeEventListener("click", resumeAudioContext);
                        document.removeEventListener("touchstart", resumeAudioContext);
                        return;
                    }

                    analyser.getByteFrequencyData(dataArray);

                    // Sum frequency amplitude to detect breath/blowing sound
                    let freqSum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        freqSum += dataArray[i];
                    }
                    const avgAmplitude = freqSum / bufferLength;

                    // Trigger blow out if sound is loud enough
                    if (avgAmplitude > 55) {
                        blowOutCandle();
                    } else {
                        requestAnimationFrame(detectBlow);
                    }
                };

                requestAnimationFrame(detectBlow);
            })
            .catch(err => {
                console.log("Microphone permission denied or unavailable. Activating safety tap fallback.");
                actionTitle.innerHTML = "Tap the flame to blow it out & make a wish... 🕯️✨";
            });
    }

    // --------------------------------------------------
    // 2. PERSONALIZATION INITIALIZER
    // --------------------------------------------------
    function initializePersonalization() {
        // Names & Hero
        document.getElementById("hero-gf-name").textContent = loveConfig.girlfriendName;
        document.getElementById("hero-bf-quote").textContent = loveConfig.birthdayMessage;
        document.getElementById("letter-signature-name").textContent = loveConfig.boyfriendName;
        document.getElementById("final-bf-name").textContent = loveConfig.boyfriendName;

        // Dynamic Love Letter Inserter
        const letterBody = document.getElementById("love-letter-content");
        letterBody.innerHTML = `
            <p>Happy Birthday to the most beautiful person in my world, my love. ❤️</p>
            <p>Today, I just want you to know how incredibly grateful I am to have you in my life. You've brought so much love, warmth, happiness, and meaning into my world, and I honestly don't know what I would do without you.</p>
            <p>You have this beautiful way of making even ordinary days feel special just by being there. I love you more than words can truly explain.</p>
            <p>I appreciate every little thing about you—your smile, your kindness, your heart, the way you care, and all those little things you probably don't even realize make you so special to me.</p>
            <p>On your birthday, I wish you endless happiness, good health, success, peace, and all the beautiful things your heart desires. May every dream you have slowly become reality, and may you always have reasons to smile.</p>
            <p>I hope I can continue to stand beside you, support you, make you smile, and love you through every chapter of life. You deserve the whole world and so much more. Thank you for being you.</p>
            <p>I love you, today, tomorrow, and always. ❤️✨</p>
        `;

        // Load Gallery
        const galleryGrid = document.getElementById("gallery-grid");
        loveConfig.photos.forEach((photo, idx) => {
            const card = document.createElement("div");
            card.className = "photo-card animate-view";
            card.dataset.index = idx;

            // Generate a random rotation between -4 and +4 degrees for polaroid feel
            const randomRot = (Math.random() * 8 - 4).toFixed(2);
            card.style.setProperty('--random-rotation', `${randomRot}deg`);

            // Set image with fallback logic
            const frame = document.createElement("div");
            frame.className = "photo-frame";

            const img = document.createElement("img");
            img.src = photo.url;
            img.alt = photo.caption;
            img.loading = "lazy";

            // Fallback for missing local photos
            img.onerror = () => {
                frame.innerHTML = `
                    <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#FFF8F3; padding:16px; border-radius:16px; text-align:center; color:#E98BA8; border: 1px dashed rgba(233,139,168,0.35);">
                        <span style="font-size:2rem; margin-bottom:8px;">❤️</span>
                        <p style="font-family:'Cormorant Garamond', serif; font-size:1.1rem; font-style:italic;">Photo Memory ${idx + 1}</p>
                        <p style="font-size:0.75rem; color:#321B2F; opacity:0.6; margin-top:4px;">Add your image to images/photo${idx + 1}.jpg</p>
                    </div>
                `;
            };

            if (img.onerror) {
                frame.appendChild(img);
            }

            const cap = document.createElement("p");
            cap.className = "photo-caption";
            cap.textContent = photo.caption;

            card.appendChild(frame);
            card.appendChild(cap);
            galleryGrid.appendChild(card);

            // Lightbox trigger on click
            card.addEventListener("click", () => openLightbox(idx));

            // Apply 3D Tilt
            apply3DTilt(card, 15);
        });

        // Load Reasons
        const reasonsGrid = document.getElementById("reasons-grid");
        loveConfig.reasonsWhyILoveYou.forEach((reason) => {
            const card = document.createElement("div");
            card.className = "reason-card animate-view";
            card.innerHTML = `
                <span class="reason-icon">${reason.icon}</span>
                <p class="reason-text">${reason.text}</p>
            `;
            reasonsGrid.appendChild(card);

            // Apply 3D Tilt
            apply3DTilt(card, 12);
        });

        // Load Timeline
        const timelineContainer = document.getElementById("timeline-container");
        loveConfig.timeline.forEach((item) => {
            const row = document.createElement("div");
            row.className = "timeline-item animate-view";
            row.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="timeline-date">${item.date}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.desc}</p>
                </div>
            `;
            timelineContainer.appendChild(row);
        });

        // Load Wishes
        const wishesGrid = document.getElementById("wishes-grid");
        loveConfig.wishes.forEach((wish) => {
            const card = document.createElement("div");
            card.className = "wish-card animate-view";
            card.innerHTML = `<p class="wish-text">${wish}</p>`;
            wishesGrid.appendChild(card);

            // Apply 3D Tilt
            apply3DTilt(card, 10);
        });
    }

    // 3D Tilt Effect function definition
    function apply3DTilt(element, maxAngle = 12) {
        if (window.innerWidth < 768) return; // Disable tilt on mobile for performance

        element.style.transformStyle = "preserve-3d";
        element.style.transition = "transform 0.1s ease, box-shadow 0.1s ease";

        element.addEventListener("mousemove", (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;

            const rotX = -(normY * maxAngle).toFixed(2);
            const rotY = (normX * maxAngle).toFixed(2);

            const randomRot = element.style.getPropertyValue('--random-rotation') || "0deg";

            if (element.classList.contains("photo-card")) {
                element.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.06, 1.06, 1.06) rotate(0deg)`;
                element.style.zIndex = "50";
            } else {
                element.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04, 1.04, 1.04)`;
            }
        });

        element.addEventListener("mouseleave", () => {
            element.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease";
            const randomRot = element.style.getPropertyValue('--random-rotation');
            if (element.classList.contains("photo-card")) {
                element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) rotate(${randomRot || '0deg'})`;
                element.style.zIndex = "";
            } else {
                element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            }
        });
    }

    // --------------------------------------------------
    // 3. NAVIGATION NAVIGATION LOGIC
    // --------------------------------------------------
    const navToggle = document.getElementById("nav-toggle");
    const navLinksList = document.getElementById("nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    navToggle.addEventListener("click", () => {
        navLinksList.classList.toggle("active");
        navToggle.classList.toggle("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinksList.classList.remove("active");
            navToggle.classList.remove("active");
        });
    });

    // Smooth navigation scrolling
    document.getElementById("btn-hero-explore").addEventListener("click", () => {
        document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
    });

    // --------------------------------------------------
    // 4. LIGHTBOX CONTROLS
    // --------------------------------------------------
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");

    function openLightbox(index) {
        const photo = loveConfig.photos[index];
        lightboxImg.src = photo.url;
        lightboxCaption.textContent = photo.caption;

        // Handle fallback in lightbox
        lightboxImg.onerror = () => {
            lightboxImg.style.display = "none";
            lightboxCaption.textContent = `Memory ${index + 1}: ${photo.caption} (Add your image file to display)`;
        };
        lightboxImg.style.display = "inline-block";

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });

    // --------------------------------------------------
    // 5. INTERACTIVE HEARTBEAT ACTION
    // --------------------------------------------------
    const btnTapHeart = document.getElementById("btn-tap-heart");
    const heartMessage = document.getElementById("heart-message");

    btnTapHeart.addEventListener("click", (e) => {
        btnTapHeart.classList.add("pressed", "active");

        // Spawn customized heart bubble message
        heartMessage.textContent = loveConfig.heartbeatMessage;
        heartMessage.classList.remove("hidden");

        // Spawn a burst of tiny floatable hearts
        const rect = btnTapHeart.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            createBurstHeart(centerX, centerY);
        }

        setTimeout(() => {
            btnTapHeart.classList.remove("pressed");
        }, 300);
    });

    function createBurstHeart(x, y) {
        const h = document.createElement("div");
        h.className = "trail-particle";
        h.innerHTML = Math.random() > 0.5 ? "❤️" : "🌸";
        h.style.left = `${x}px`;
        h.style.top = `${y}px`;
        h.style.fontSize = `${Math.random() * 15 + 15}px`;

        // Random velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 2; // general upward bias

        document.body.appendChild(h);

        let posX = x;
        let posY = y;
        let opacity = 1;

        const animate = () => {
            if (opacity <= 0) {
                h.remove();
                return;
            }
            posX += vx;
            posY += vy;
            opacity -= 0.02;

            h.style.left = `${posX}px`;
            h.style.top = `${posY}px`;
            h.style.opacity = opacity;
            h.style.transform = `translate(-50%, -50%) scale(${opacity})`;

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    // --------------------------------------------------
    // 6. SECRET SURPRISE TYPING REVEAL
    // --------------------------------------------------
    const btnReveal = document.getElementById("btn-reveal");
    const revealTextContainer = document.getElementById("reveal-text-container");
    const typedTextElement = document.getElementById("typed-surprise-text");
    let hasTyped = false;

    btnReveal.addEventListener("click", () => {
        btnReveal.classList.add("pressed");

        if (!hasTyped) {
            hasTyped = true;
            btnReveal.style.display = "none";
            revealTextContainer.classList.remove("hidden");
            typeWriterEffect(loveConfig.secretSurpriseMessage, typedTextElement, 45);
        }
    });

    function typeWriterEffect(text, element, speed) {
        let index = 0;
        element.innerHTML = "";

        const type = () => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        type();
    }

    // --------------------------------------------------
    // 7. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // --------------------------------------------------
    const animatedElements = document.querySelectorAll(".animate-up, .animate-view");

    // Configuration for observer
    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-active");

                // Specific trigger for final section confetti
                if (entry.target.id === "final-section" || entry.target.classList.contains("final-section")) {
                    triggerConfetti(65);
                }

                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --------------------------------------------------
    // 8. FLOATING MUSIC PLAYER ENGINE
    // --------------------------------------------------
    // musicPlayer is already defined at the top
    const playerSongTitle = document.getElementById("player-song-title");
    const playerSongArtist = document.getElementById("player-song-artist");
    const btnPlayPause = document.getElementById("btn-play-pause");
    const playIcon = btnPlayPause.querySelector(".play-icon");
    const pauseIcon = btnPlayPause.querySelector(".pause-icon");
    const playerDisc = document.getElementById("player-disc");
    const volumeSlider = document.getElementById("volume-slider");

    // Set custom song labels
    playerSongTitle.textContent = loveConfig.songTitle;
    playerSongArtist.textContent = loveConfig.songArtist;



    // Gracefully handle missing audio source
    audio.addEventListener("error", () => {
        console.warn("Romantic audio file 'music/apna-bana-le.mp3' was not found or failed to load. Graceful music fallback triggered.");
        playerSongTitle.textContent = "Add your song here ❤️";
        playerSongArtist.textContent = "Ready to play";
        audio.dataset.failed = "true";
    });

    function updatePlayPauseButton(isPlaying) {
        if (isPlaying) {
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");
            playerDisc.classList.add("playing");
        } else {
            playIcon.classList.remove("hidden");
            pauseIcon.classList.add("hidden");
            playerDisc.classList.remove("playing");
        }
    }

    btnPlayPause.addEventListener("click", () => {
        if (audio.dataset.failed === "true") {
            alert("To hear your special song, copy a legally owned/licensed MP3 file into your 'music' folder and rename it to 'apna-bana-le.mp3'! ❤️");
            return;
        }

        if (audio.paused) {
            audio.play().then(() => {
                updatePlayPauseButton(true);
            }).catch(() => {
                alert("Please click anywhere on the page first, then tap play! ❤️");
            });
        } else {
            audio.pause();
            updatePlayPauseButton(false);
        }
    });

    // Sync volume slider
    volumeSlider.addEventListener("input", (e) => {
        audio.volume = e.target.value;
    });

    // --------------------------------------------------
    // 9. BACKGROUND PARTICLES & CONFETTI ENGINE (Canvas)
    // --------------------------------------------------
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");

    let particles = [];
    let confetti = [];
    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 18 : 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle template - Floating Balloons
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 40; // spawn slightly below viewport
            this.size = Math.random() * 8 + 6; // balloon size
            this.speedY = Math.random() * 0.6 + 0.3; // gentle upward drift
            this.speedX = Math.random() * 0.4 - 0.2; // slight side sway
            this.opacity = Math.random() * 0.4 + 0.15; // translucent overlay feel

            // Theme colors for balloons (shades of rose, lavender, and gold matching our palette)
            const colors = [
                `rgba(233, 139, 168, ${this.opacity})`, // rose pink
                `rgba(155, 114, 223, ${this.opacity})`, // amethyst purple
                `rgba(232, 199, 123, ${this.opacity})`, // soft gold
                `rgba(248, 200, 220, ${this.opacity})`  // blush pink
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            // Loop balloon back to bottom when it exits top
            if (this.y < -50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();

            // 1. Draw Balloon Main Body (Egg Ellipse Shape)
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size * 0.85, this.size * 1.15, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // 2. Draw Little Knot/Triangle at base
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.size * 1.15);
            ctx.lineTo(this.x - this.size * 0.16, this.y + this.size * 1.38);
            ctx.lineTo(this.x + this.size * 0.16, this.y + this.size * 1.38);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();

            // 3. Draw Thin Wavy String hanging down
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.size * 1.38);
            ctx.quadraticCurveTo(
                this.x - this.size * 0.25,
                this.y + this.size * 2.0,
                this.x,
                this.y + this.size * 2.8
            );
            ctx.strokeStyle = `rgba(50, 27, 47, ${this.opacity * 0.25})`; // very light string matching text theme
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.restore();
        }
    }

    // Petal template - Falling Cherry Blossoms / Rose Petals
    class Petal {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 0.9 + 0.6; // gentle falling drift
            this.speedX = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.35;

            this.oscillationSpeed = Math.random() * 0.02 + 0.01;
            this.oscillationAngle = Math.random() * Math.PI * 2;
            this.oscillationRange = Math.random() * 1.2 + 0.4;

            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 1.5 - 0.75;

            const colors = [
                `rgba(255, 183, 197, ${this.opacity})`, // cherry blossom pink
                `rgba(255, 105, 180, ${this.opacity})`, // hot rose pink
                `rgba(248, 200, 220, ${this.opacity})`, // light blush
                `rgba(219, 112, 147, ${this.opacity})`  // pale violet red
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.oscillationAngle += this.oscillationSpeed;
            this.x += Math.sin(this.oscillationAngle) * this.oscillationRange + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);

            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.7, this.size, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Highlight shine
            ctx.beginPath();
            ctx.ellipse(-this.size * 0.2, -this.size * 0.2, this.size * 0.15, this.size * 0.3, Math.PI / 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.65})`;
            ctx.fill();

            ctx.restore();
        }
    }

    // Confetti template
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -100 - 20;
            this.size = Math.random() * 10 + 6;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 3 - 1.5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;

            // Romantic shades
            const colors = [
                "rgba(248, 200, 220, 0.8)", // blush pink
                "rgba(233, 139, 168, 0.8)", // rose pink
                "rgba(200, 182, 232, 0.8)", // lavender
                "rgba(232, 199, 123, 0.85)"  // gold
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.isHeart = Math.random() > 0.4;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;

            if (this.isHeart) {
                drawHeartShape(ctx, 0, 0, this.size);
            } else {
                // draw diamond/star
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size / 2, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size / 2, 0);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Helper: Draw pure canvas vector heart
    function drawHeartShape(context, x, y, size) {
        context.beginPath();
        context.moveTo(x, y + size / 4);
        context.quadraticCurveTo(x, y, x + size / 2, y);
        context.quadraticCurveTo(x + size, y, x + size, y + size / 3);
        context.quadraticCurveTo(x + size, y + size * 2 / 3, x + size / 2, y + size);
        context.quadraticCurveTo(x, y + size * 2 / 3, x, y + size / 4);
        context.closePath();
        context.fill();
    }

    // Populate backdrop particles with a mix of rising balloons and falling petals
    for (let i = 0; i < maxParticles; i++) {
        if (i % 2 === 0) {
            particles.push(new Particle());
        } else {
            particles.push(new Petal());
        }
    }

    // Confetti Spawner Function
    function triggerConfetti(count) {
        // Skip heavy canvas animations if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        for (let i = 0; i < count; i++) {
            confetti.push(new Confetti());
        }
    }

    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw backdrop floaters
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // 2. Draw confetti falling items
        for (let i = confetti.length - 1; i >= 0; i--) {
            const c = confetti[i];
            c.update();
            c.draw();

            // Remove confetti off screen
            if (c.y > canvas.height + 20) {
                confetti.splice(i, 1);
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --------------------------------------------------
    // 10. INTERACTIVE CURSOR & TOUCH TRAIL
    // --------------------------------------------------
    const createTrail = (x, y) => {
        const trail = document.createElement("div");
        trail.className = "trail-particle";
        const symbols = ["✨", "❤️", "🌸", "💖", "🌟", "🎈"];
        trail.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.fontSize = `${Math.random() * 15 + 10}px`;

        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 1200);
    };

    let lastTrailTime = 0;
    const trailThrottle = 40; // millisecond throttle

    const handleTrailMove = (clientX, clientY) => {
        const now = Date.now();
        if (now - lastTrailTime > trailThrottle) {
            createTrail(clientX, clientY);
            lastTrailTime = now;
        }
    };

    document.addEventListener("mousemove", (e) => {
        handleTrailMove(e.clientX, e.clientY);
    });

    document.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0]) {
            handleTrailMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // --------------------------------------------------
    // 11. WAVY SCROLLING 3D BUTTERFLIES LOGIC (2 Butterflies)
    // --------------------------------------------------
    const butterfly1 = document.getElementById("scrolling-butterfly-1");
    const butterfly2 = document.getElementById("scrolling-butterfly-2");

    if (butterfly1 || butterfly2) {
        const updateButterflies = () => {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = documentHeight > 0 ? (window.scrollY / documentHeight) : 0;

            // Butterfly 1 Coordinates
            const waveX1 = 12 + scrollPercent * 62 + Math.sin(scrollPercent * Math.PI * 5.5) * 10;
            const pathY1 = 8 + scrollPercent * 78;

            // Butterfly 1 Look-ahead for tilt
            const nextPercent1 = Math.min(1, scrollPercent + 0.005);
            const nextX1 = 12 + nextPercent1 * 62 + Math.sin(nextPercent1 * Math.PI * 5.5) * 10;
            const nextY1 = 8 + nextPercent1 * 78;
            const angleDeg1 = Math.atan2(nextY1 - pathY1, nextX1 - waveX1) * (180 / Math.PI) - 90;

            if (butterfly1) {
                butterfly1.style.left = `${waveX1}%`;
                butterfly1.style.top = `${pathY1}%`;
                butterfly1.style.transform = `rotate(${angleDeg1}deg)`;
            }

            // Butterfly 2 Coordinates (Opposite sine phase to make them cross paths!)
            const waveX2 = 22 + scrollPercent * 58 + Math.sin(scrollPercent * Math.PI * 5.5 + Math.PI) * 14;
            const pathY2 = 14 + scrollPercent * 72;

            // Butterfly 2 Look-ahead for tilt
            const nextPercent2 = Math.min(1, scrollPercent + 0.005);
            const nextX2 = 22 + nextPercent2 * 58 + Math.sin(nextPercent2 * Math.PI * 5.5 + Math.PI) * 14;
            const nextY2 = 14 + nextPercent2 * 72;
            const angleDeg2 = Math.atan2(nextY2 - pathY2, nextX2 - waveX2) * (180 / Math.PI) - 90;

            if (butterfly2) {
                butterfly2.style.left = `${waveX2}%`;
                butterfly2.style.top = `${pathY2}%`;
                butterfly2.style.transform = `rotate(${angleDeg2}deg) scale(0.8)`;
            }
        };

        window.addEventListener("scroll", updateButterflies);
        window.addEventListener("resize", updateButterflies);

        // Trigger initial positioning so they don't start offscreen
        setTimeout(updateButterflies, 200);
        setTimeout(updateButterflies, 1500);
    }

});
