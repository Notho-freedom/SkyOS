import React, { useState, useEffect } from 'react';

const Chrome = () => {
    const homeUrl = 'https://www.google.com/webhp?igu=1';
    const [url, setUrl] = useState(homeUrl);
    const [displayUrl, setDisplayUrl] = useState("https://www.google.com");

    useEffect(() => {
        const lastVisitedUrl = localStorage.getItem("chrome-url");
        const lastDisplayedUrl = localStorage.getItem("chrome-display-url");
        if (lastVisitedUrl) {
            setUrl(lastVisitedUrl);
            setDisplayUrl(lastDisplayedUrl || lastVisitedUrl);
        }
    }, []);

    const storeVisitedUrl = (newUrl, newDisplayUrl) => {
        localStorage.setItem("chrome-url", newUrl);
        localStorage.setItem("chrome-display-url", newDisplayUrl);
    };

    const refreshChrome = () => {
        document.getElementById("chrome-screen").src += '';
    };

    const goToHome = () => {
        setUrl(homeUrl);
        setDisplayUrl("https://www.google.com");
        refreshChrome();
    };

    const checkKey = (e) => {
        if (e.key === "Enter") {
            let newUrl = e.target.value.trim();
            if (!newUrl) return;
            
            if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
                newUrl = "https://" + newUrl;
            }
            newUrl = encodeURI(newUrl);

            let newDisplayUrl = newUrl;
            if (newUrl.includes("google.com")) {
                newUrl = homeUrl;
                newDisplayUrl = "https://www.google.com";
            }
            
            setUrl(newUrl);
            setDisplayUrl(newDisplayUrl);
            storeVisitedUrl(newUrl, newDisplayUrl);
            e.target.blur();
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-ub-cool-grey">
            <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900">
                <div onClick={refreshChrome} className="ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
                    <img className="w-5" src="./themes/Yaru/status/chrome_refresh.svg" alt="Refresh" />
                </div>
                <div onClick={goToHome} className="mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
                    <img className="w-5" src="./themes/Yaru/status/chrome_home.svg" alt="Home" />
                </div>
                <input 
                    onKeyDown={checkKey} 
                    onChange={(e) => setDisplayUrl(e.target.value)} 
                    value={displayUrl} 
                    id="chrome-url-bar" 
                    className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 w-5/6 text-gray-300 focus:text-white" 
                    type="url" 
                    spellCheck={false} 
                    autoComplete="off" 
                />
            </div>
            <iframe src={url} className="flex-grow" id="chrome-screen" frameBorder="0" title="Browser"></iframe>
        </div>
    );
};

export default Chrome;
