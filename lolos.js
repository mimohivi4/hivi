(function() {
    // 1. Get the 'article' parameter from the current URL browser bar
    // Example: if URL is ?article=truman-cbd-gummies-male-enhancement
    const queryParams = new URLSearchParams(window.location.search);
    const articleName = queryParams.get('ids');
    const host = window.location.host;

    // 2. Stop if no article parameter is provided in the URL
    if (!articleName) {
        console.error("Initialization failed: No 'ids' query parameter found.");
        return;
    }

    // 3. Construct the clean endpoint URL matching your get.php parameter requirements
    const targetUrl = `https://rok.appdal.com/kr/input.php?ids=${encodeURIComponent(articleName)}&host=${encodeURIComponent(host)}`;

    // 4. Fetch the content from your get.php script
    fetch(targetUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(responseText => {
            try {
                // If your backend responds with a JSON object containing a redirect link
                const data = JSON.parse(responseText);
                
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                } else {
                    console.log("Article data verified, no redirect required.");
                }
            } catch (jsonError) {
                // If it's not JSON, it's raw HTML (your article content). Render it directly.
                renderHtmlContent(responseText);
            }
        })
        .catch(error => {
            console.error("Failed to load article content:", error);
        });

    /**
     * Updates the page body safely with the returned article HTML markup
     * @param {string} htmlContent 
     */
    function renderHtmlContent(htmlContent) {
        // Clear anything currently on the page
        document.body.innerHTML = "";
        
        // Inject the freshly fetched HTML review content dynamically
        const wrapper = document.createElement('div');
        wrapper.className = "article-container";
        wrapper.innerHTML = htmlContent;
        document.body.appendChild(wrapper);
    }
})();
