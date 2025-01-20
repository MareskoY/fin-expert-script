const CHAT_DOMAIN = "http://localhost:3000";
const CHAT_DOMAIN = "https://app.askfinancas.pt";
// ===================== Styles=====================
const STYLES_DEFAULT = `
    @font-face {
        font-family: 'Roboto';
        font-weight: 400;
        font-style: normal;
        src: url('/fonts/Roboto-Regular.woff2') format('woff2'), 
             url('/fonts/Roboto-Regular.woff') format('woff');
    }
    
    @font-face {
        font-family: 'Roboto';
        font-weight: 500;
        font-style: normal;
        src: url('/fonts/Roboto-Regular.woff2') format('woff2'), 
             url('/fonts/Roboto-Regular.woff') format('woff');
    }
    
    @font-face {
        font-family: 'Roboto';
        font-weight: 700;
        font-style: normal;
        src: url('/fonts/Roboto-Bold.woff2') format('woff2'), 
             url('/fonts/Roboto-Bold.woff') format('woff');
    }

    #chapa-shopper-aid-button-container-circle {
        all: initial;
        position: fixed;
        bottom: -10px; 
        right: 28px; 
        transform: translateY(-50%) translateX(100%); 
        width: 48px !important;
        height: 48px !important;
        display: flex; 
        justify-content: center;
        align-items: center;
        z-index: 2147483647 !important;
        transition: transform 0.2s ease-out;
    }
    
    #chapa-shopper-aid-button-container-circle.show {
        transform: translateY(-50%) translateX(0);
    }

    #chapa-shopper-aid-button-container-circle::before {
        content: '';
        position: absolute;
        bottom: 0; 
        right: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #A770EF 0%, #FDB99B 100%);
        filter: blur(16px);
        box-shadow: 16px 16px 16px rgba(0,0,0,0.2);
        border-radius: 15px;
        z-index: -1;
    }
    
    #chapa-shopper-aid-button-circle {
        position: absolute;
        background-color: #181B20;
        border: none;
        cursor: pointer;
        display: flex;
        width: 48px !important;
        height: 48px !important;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    
    #chapa-shopper-aid-button-circle img {
        width: 32px;
        height: 100%;
    }

    #chapa-shopper-aid-container {
        all: initial;
        visibility: hidden;
        position: fixed;
        top: 0px;
        right: 0px;
        z-index: 2147483647 !important;
        height: 100%;
        margin-bottom: 20px;
        width: 800px;
        background-color: #181B20;
        overflow: hidden;
        border-radius: 20px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: 2px solid white;
        box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    }
    
    #chapa-shopper-aid-container.popup-circle {
        top: auto;
        bottom: 60px;
        right: 10px;
        height: calc(76% - 0px);
        overflow: hidden;
        border-radius: 20px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease-out;
    }

    @media screen and (max-width: 600px) { 
        #chapa-shopper-aid-container {
            width: 100vw !important;
            height: 100% !important; 
            border-radius: 0 !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
        }
    }
    
    #chapa-shopper-aid-container.show {
        visibility: visible;
        opacity: 1;
        transform: translateX(0);
    }
    
    #chapa-shopper-aid-iframe {
        display: block; 
        width: 100%;
        height: 100%;
        border: none;
    }
    
    #cross-icon {
        display: flex;
        visibility: hidden;
        position: absolute;
        transform: rotate(-180deg);
        transition: transform 0.3s ease, opacity 0.3s ease, visibility 0s 0.3s;
    }  
    
    #chat-icon {
        display: flex;
        position: absolute;
        transition: transform 0.3s ease, opacity 0.3s ease, visibility 0s 0.3s;
    }  
`;

const scrollbarStyleElement = document.createElement("style");
document.head.appendChild(scrollbarStyleElement);

function addScrollbarStyles() {
    scrollbarStyleElement.innerHTML = `
      ::-webkit-scrollbar {
          width: 0px;
      }
      ::-webkit-scrollbar-track {
          background: transparent;
      }
      ::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 1px;
      }
  `;
}

function removeScrollbarStyles() {
    scrollbarStyleElement.innerHTML = "";
}

// ===================== Main function (one parameter auth) =====================
function start({token}) {
    // 1) Add styles
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = STYLES_DEFAULT;
    document.head.appendChild(styleSheet);

    // 2) Create container and button (circle only)
    const chatButtonContainer = document.createElement("div");
    chatButtonContainer.id = "chapa-shopper-aid-button-container-circle";
    const chatButton = document.createElement("div");
    chatButton.id = "chapa-shopper-aid-button-circle";

    // 3) Create icons
    const crossIcon = document.createElement("div");
    crossIcon.id = "cross-icon";
    crossIcon.innerHTML = `
    <svg viewBox="0 0 24 24" style="width: 24px; height: 24px;">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white"/>
    </svg>`;

    const chatIcon = document.createElement("div");
    chatIcon.id = "chat-icon";
    // This is where the chat icon is set (visible while the chat is closed)
    chatIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32" style="width: 24px; height: 24px;">
          <path d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88 0 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z" fill="white">
          </path>
      </svg>`;

    // 4) Add icons to the button
    chatButton.appendChild(chatIcon);
    chatButton.appendChild(crossIcon);
    chatButtonContainer.appendChild(chatButton);
    document.body.appendChild(chatButtonContainer);

    // 5) Create the chat container (iframe - the only popup view)
    const chatContainer = document.createElement("div");
    chatContainer.id = "chapa-shopper-aid-container";
    chatContainer.classList.add("popup-circle");

    // 6) Create iframe
    const chatIframe = document.createElement("iframe");
    chatIframe.id = "chapa-shopper-aid-iframe";
    // TODO: Use jwt_token here
    const domain = window.location.hostname;
    console.log("token", token)
    console.log("domain", domain)
    // http://localhost:3000/auto-login?token=e7df5b5b-eee4-47f8-8a4e-3884b3fe5c43&domain=bb-nikita-test-env.myshopify.com
    chatIframe.src = `${CHAT_DOMAIN}/auto-login?token=${token}&domain=${domain}`;
    chatContainer.appendChild(chatIframe);
    document.body.appendChild(chatContainer);

    // 7) Functions to open/close chat
    function isMobileDevice() {
        return window.innerWidth <= 600;
    }

    function toggleParentPageScrolling(disableScroll) {
        if (disableScroll) {
            document.body.style.overflow = "hidden";
        } else {
            setTimeout(() => {
                document.body.style.overflow = "";
            }, 500);
        }
    }

    function handleChatVisibility() {
        // If chat is already open, close it
        if (chatContainer.classList.contains("show")) {
            chatContainer.classList.remove("show");
            chatContainer.addEventListener(
                "transitionend",
                function () {
                    chatContainer.style.visibility = "hidden";
                },
                { once: true },
            );
            removeScrollbarStyles();

            // Switch icons
            crossIcon.style.opacity = "0";
            crossIcon.style.visibility = "hidden";
            crossIcon.style.transform = "rotate(-180deg)";

            chatIcon.style.opacity = "1";
            chatIcon.style.visibility = "visible";
            chatIcon.style.transform = "rotate(0deg)";

            // Restore scrolling on mobile
            if (isMobileDevice()) {
                toggleParentPageScrolling(false);
            }
        } else {
            // Open chat
            chatContainer.style.visibility = "visible";
            chatContainer.classList.add("show");

            // Switch icons
            chatIcon.style.opacity = "0";
            chatIcon.style.visibility = "hidden";
            chatIcon.style.transform = "rotate(180deg)";

            crossIcon.style.opacity = "1";
            crossIcon.style.visibility = "visible";
            crossIcon.style.transform = "rotate(0deg)";

            addScrollbarStyles();
            if (isMobileDevice()) {
                toggleParentPageScrolling(true);
            }
        }
    }

    // 8) Event listener for button click
    chatButton.addEventListener("click", function () {
        handleChatVisibility();
    });

    // 9) Show the button immediately
    chatButtonContainer.classList.add("show");
}

// ===================== Script initialization (DOM ready) =====================
document.addEventListener("DOMContentLoaded", function () {
    const script = document.getElementById("tax-expert");
    let token, uuid, buttonType, iframeType, openState, _iconValue, language;
    setTimeout(function () {
        if (script.src.includes("chat_script_tax_expert.js")) {
            const url = new URL(script.src);
            //TODO 1111 is mock
            token = url.searchParams.get("token") || 1111;
            console.log("token2222", token)
            start({token});
        }
    }, 1000);
});
