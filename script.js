// Global variables for DOM elements to be accessible by all functions
let markdownInput, generatePdfButton, messageArea, previewArea;

function initializeMarpDependentLogic() {
    // Ensure button is enabled and text is correct, as Marp is now confirmed loaded
    if (generatePdfButton) {
        generatePdfButton.disabled = false;
        generatePdfButton.textContent = "Generate PDF (Preview HTML)";
    } else {
        // This case should ideally not happen if waitForMarp is called after DOM is somewhat ready
        console.error("generatePdfButton not found during Marp initialization!");
        return;
    }

    generatePdfButton.addEventListener('click', () => {
        const markdownText = markdownInput.value;

        if (!markdownText.trim()) {
            showMessage('Please enter some Markdown text.', 'error');
            if (previewArea) previewArea.innerHTML = ''; // Clear preview
            return;
        }

        showMessage('Generating HTML preview...', 'info');
        if (previewArea) previewArea.innerHTML = ''; // Clear previous preview

        try {
            // Initialize Marp
            const marp = new Marp.Marp({
                html: true,
            });

            // Render the markdown
            const { html, css } = marp.render(markdownText);

            // Inject CSS into the document's head
            let styleTag = document.getElementById('marp-style');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'marp-style';
                document.head.appendChild(styleTag);
            }
            styleTag.textContent = css;

            // Display HTML in the preview area
            if (previewArea) {
                previewArea.innerHTML = html;
            }
            
            showMessage('HTML Preview generated successfully.', 'success');

        } catch (error) {
            console.error("Error generating HTML/CSS with Marp:", error);
            showMessage(`Error generating preview: ${error.message}`, 'error');
            if (previewArea) {
                previewArea.innerHTML = `<p style="color:red;">Error rendering Marp content: ${error.message}</p>`;
            }
        }
    });
}

function showMessage(message, type) {
    if (messageArea) {
        messageArea.textContent = message;
        messageArea.className = ''; // Clear existing classes
        messageArea.classList.add('messageArea', type);
        messageArea.style.display = 'block';
    } else {
        console.warn("Message area DOM element not found. Message:", message, "Type:", type);
        // Fallback to alert if messageArea isn't there, especially for early critical errors
        if (type === 'error') {
            alert("Error: " + message + " (Message area not found)");
        }
    }
}

function waitForMarp(maxAttempts = 20, interval = 200) { // Try for 4 seconds
    let attempts = 0;

    function check() {
        if (typeof window.Marp !== 'undefined' && typeof window.Marp.Marp !== 'undefined') {
            console.log("Marp library loaded successfully after " + attempts + " attempts.");
            initializeMarpDependentLogic();
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(check, interval);
            } else {
                console.error("Marp library failed to load after " + maxAttempts + " attempts.");
                showMessage('Error: Marp Core library could not be loaded. Preview functionality will be disabled.', 'error');
                if (generatePdfButton) {
                    generatePdfButton.disabled = true;
                    generatePdfButton.textContent = "Preview Disabled (Marp Lib Error)";
                }
            }
        }
    }
    check();
}

// Wait for the basic DOM structure to be ready before trying to find elements
document.addEventListener('DOMContentLoaded', () => {
    // Assign DOM elements to global variables
    markdownInput = document.getElementById('markdownInput');
    generatePdfButton = document.getElementById('generatePdfButton');
    messageArea = document.getElementById('messageArea');
    previewArea = document.getElementById('previewArea');

    // Check if essential buttons or areas are missing early
    if (!generatePdfButton) {
        showMessage("Critical Error: UI component 'generatePdfButton' not found. Page may not function.", "error");
        return; // Stop if essential UI is missing
    }
    if (!messageArea) {
        // Log this, but don't necessarily stop everything if only messageArea is missing
        console.error("Critical Error: UI component 'messageArea' not found.");
    }


    // Start polling for Marp
    waitForMarp();
});
