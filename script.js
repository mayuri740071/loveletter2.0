"use strict";

/* ========================================
   LOVELETTER — LETTER EDITOR
======================================== */


/* ========================================
   GLASS BUBBLE CURSOR
======================================== */

const cursor = document.querySelector(".love-cursor");

if (cursor && window.matchMedia("(pointer: fine)").matches) {

    document.addEventListener("mousemove", (event) => {

        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;

    });

}


/* ========================================
   ELEMENTS
======================================== */

const letterPaper = document.getElementById("letter-paper");

const previewGreeting = document.getElementById("preview-greeting");
const previewMessage = document.getElementById("preview-message");
const previewSignature = document.getElementById("preview-signature");

const recipientInput = document.getElementById("recipient");
const greetingInput = document.getElementById("greeting");
const messageInput = document.getElementById("message");
const signatureInput = document.getElementById("signature");

const messageCount = document.getElementById("message-count");

const downloadButton = document.getElementById("download-letter");

const customColorInput = document.getElementById("custom-color");


/* ========================================
   PHOTO ELEMENTS
======================================== */

const photoInput = document.getElementById("photo-input");
const removePhotoButton = document.getElementById("remove-photo");

const letterPolaroid = document.getElementById("letter-polaroid");
const polaroidImage = document.getElementById("polaroid-image");
const polaroidCaption = document.getElementById("polaroid-caption-text");

let currentPhotoUrl = null;


/* ========================================
   DEFAULTS
======================================== */

const DEFAULTS = {
    font: "classic",
    color: "#c93657",
    theme: "textured"
};

const FALLBACK_RECIPIENT = "Someone Special";

const FALLBACK_GREETING = "Dear";

const FALLBACK_MESSAGE =
    "Your letter will appear here. Every word you write will become part of this little gift.";

const FALLBACK_SIGNATURE = "With love";


/* ========================================
   FONT MAP
======================================== */

const FONT_MAP = {

    classic: 'Georgia, "Times New Roman", serif',

    elegant: '"Palatino Linotype", "Book Antiqua", Palatino, serif',

    modern: '"Trebuchet MS", Arial, sans-serif',

    handwritten: '"Segoe Print", "Bradley Hand", cursive',

    typewriter: '"Courier New", Courier, monospace'

};


/* ========================================
   INITIALIZE
======================================== */

function initializeLetter() {

    updatePreview();

    updateMessageCount();

    updateTextareaHeight();

    applySelectedFont();

    applySelectedColor();

    applySelectedTheme();

    setupPhotoState();

}


/* ========================================
   UPDATE TEXT PREVIEW
======================================== */

function updatePreview() {

    if (!previewGreeting ||
        !previewMessage ||
        !previewSignature) {
        return;
    }


    /* -------------------------------
       Recipient
    -------------------------------- */

    const recipient =
        recipientInput?.value.trim() ||
        FALLBACK_RECIPIENT;


    /* -------------------------------
       Greeting
    -------------------------------- */

    let greeting =
        greetingInput?.value.trim() ||
        FALLBACK_GREETING;


    /*
       Prevent duplicate "Dear"
       Example:

       Greeting = Dear
       Name = Mayuri

       Result:
       Dear Mayuri,
    */

    if (
        greeting.toLowerCase().replace(/[,!.\s]+$/, "") === "dear"
    ) {

        greeting = "Dear";

    }


    previewGreeting.textContent =
        `${greeting} ${recipient},`;


    /* -------------------------------
       Message
    -------------------------------- */

    const message =
        messageInput?.value.trim() ||
        FALLBACK_MESSAGE;

    previewMessage.textContent = message;


    /* -------------------------------
       Signature
    -------------------------------- */

    const signature =
        signatureInput?.value.trim() ||
        FALLBACK_SIGNATURE;

    previewSignature.textContent = signature;

}


/* ========================================
   MESSAGE COUNTER
======================================== */

function updateMessageCount() {

    if (!messageInput || !messageCount) {
        return;
    }

    const length = messageInput.value.length;

    messageCount.textContent =
        `${length} / 2000`;

}


/* ========================================
   TEXTAREA AUTO RESIZE
======================================== */

function updateTextareaHeight() {

    if (!messageInput) {
        return;
    }

    messageInput.style.height = "auto";

    messageInput.style.height =
        `${messageInput.scrollHeight}px`;

}


/* ========================================
   FONT
======================================== */

function applySelectedFont() {

    if (!letterPaper) {
        return;
    }

    const selected =
        document.querySelector(
            'input[name="font"]:checked'
        );

    const font =
        selected?.value || DEFAULTS.font;

    letterPaper.style.setProperty(
        "--letter-font",
        FONT_MAP[font] || FONT_MAP.classic
    );

}


/* ========================================
   LETTER COLOR
======================================== */

function applySelectedColor() {

    if (!letterPaper) {
        return;
    }

    const selected =
        document.querySelector(
            'input[name="letter-color"]:checked'
        );

    let color =
        selected?.value || DEFAULTS.color;


    /*
       Custom color
    */

    if (
        selected &&
        selected.value === "#custom-color" &&
        customColorInput
    ) {

        color = customColorInput.value;

    }


    letterPaper.style.setProperty(
        "--letter-color",
        color
    );

}


/* ========================================
   CUSTOM COLOR
======================================== */

function applyCustomColor() {

    if (!letterPaper || !customColorInput) {
        return;
    }

    const color = customColorInput.value;

    letterPaper.style.setProperty(
        "--letter-color",
        color
    );

}


/* ========================================
   THEME
======================================== */

function applySelectedTheme() {

    if (!letterPaper) {
        return;
    }

    const selected =
        document.querySelector(
            'input[name="theme"]:checked'
        );

    const theme =
        selected?.value || DEFAULTS.theme;


    letterPaper.classList.remove(
        "theme-textured",
        "theme-solid",
        "theme-jelly",
        "theme-midnight",
        "theme-noir"
    );


    letterPaper.classList.add(
        `theme-${theme}`
    );

}


/* ========================================
   PHOTO — INITIAL STATE
======================================== */

function setupPhotoState() {

    if (!letterPolaroid) {
        return;
    }


    /*
       Hide Polaroid until a photo
       has actually been selected.
    */

    letterPolaroid.classList.remove("show");


    if (removePhotoButton) {
        removePhotoButton.hidden = true;
    }

}


/* ========================================
   PHOTO — UPLOAD
======================================== */

function handlePhotoUpload(event) {

    const file =
        event.target.files?.[0];


    if (!file) {
        return;
    }


    /*
       Only allow images
    */

    if (!file.type.startsWith("image/")) {

        alert("Please choose an image file.");

        photoInput.value = "";

        return;
    }


    /*
       Remove previous object URL
    */

    if (currentPhotoUrl) {

        URL.revokeObjectURL(
            currentPhotoUrl
        );

    }


    /*
       Create temporary image URL
    */

    currentPhotoUrl =
        URL.createObjectURL(file);


    /*
       Put image into Polaroid
    */

    polaroidImage.src =
        currentPhotoUrl;


    /*
       Show Polaroid
    */

    letterPolaroid.classList.add("show");


    /*
       Show remove button
    */

    if (removePhotoButton) {
        removePhotoButton.hidden = false;
    }


    /*
       Update caption
    */

    if (polaroidCaption) {

        polaroidCaption.textContent =
            "A little memory";

    }

}


/* ========================================
   PHOTO — REMOVE
======================================== */

function removePhoto() {

    if (currentPhotoUrl) {

        URL.revokeObjectURL(
            currentPhotoUrl
        );

        currentPhotoUrl = null;

    }


    if (polaroidImage) {
        polaroidImage.src = "";
    }


    if (letterPolaroid) {

        letterPolaroid.classList.remove(
            "show"
        );

    }


    if (photoInput) {
        photoInput.value = "";
    }


    if (removePhotoButton) {
        removePhotoButton.hidden = true;
    }

}


/* ========================================
   WAIT FOR IMAGE
======================================== */

function waitForImageToLoad(image) {

    return new Promise((resolve) => {

        if (!image || !image.src) {

            resolve();

            return;

        }


        if (image.complete) {

            resolve();

            return;

        }


        image.addEventListener(
            "load",
            resolve,
            { once: true }
        );

        image.addEventListener(
            "error",
            resolve,
            { once: true }
        );

    });

}


/* ========================================
   DOWNLOAD PDF
======================================== */

async function downloadLetter() {

    if (
        !letterPaper ||
        !downloadButton
    ) {
        return;
    }


    /*
       Make sure uploaded photo is
       completely loaded before PDF capture.
    */

    await waitForImageToLoad(
        polaroidImage
    );


    /*
       Prevent double-click
    */

    downloadButton.disabled = true;

    const originalText =
        downloadButton.textContent;

    downloadButton.textContent =
        "Preparing...";


    try {

        const canvas =
            await html2canvas(
                letterPaper,
                {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    logging: false
                }
            );


        const imageData =
            canvas.toDataURL(
                "image/png"
            );


        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [
                    canvas.width,
                    canvas.height
                ]
            });


        pdf.addImage(
            imageData,
            "PNG",
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
           Create safe filename
        */

        const recipient =
            recipientInput?.value.trim() ||
            FALLBACK_RECIPIENT;


        const safeRecipient =
            recipient
                .replace(/[<>:"/\\|?*]+/g, "")
                .replace(/\s+/g, "-")
                .slice(0, 50);


        pdf.save(
            `LoveLetter-${safeRecipient}.pdf`
        );


    } catch (error) {

        console.error(
            "PDF download failed:",
            error
        );

        alert(
            "Something went wrong while creating the PDF. Please try again."
        );

    } finally {

        downloadButton.disabled = false;

        downloadButton.textContent =
            originalText;

    }

}


/* ========================================
   EVENT LISTENERS
======================================== */


/* Text fields */

recipientInput?.addEventListener(
    "input",
    updatePreview
);

greetingInput?.addEventListener(
    "input",
    updatePreview
);

messageInput?.addEventListener(
    "input",
    () => {

        updatePreview();

        updateMessageCount();

        updateTextareaHeight();

    }
);

signatureInput?.addEventListener(
    "input",
    updatePreview
);


/* Font */

document
    .querySelectorAll(
        'input[name="font"]'
    )
    .forEach((input) => {

        input.addEventListener(
            "change",
            applySelectedFont
        );

    });


/* Letter colors */

document
    .querySelectorAll(
        'input[name="letter-color"]'
    )
    .forEach((input) => {

        input.addEventListener(
            "change",
            () => {

                /*
                   If a preset color is selected,
                   apply it normally.
                */

                applySelectedColor();

            }
        );

    });


/* Custom color */

customColorInput?.addEventListener(
    "input",
    () => {

        /*
           Uncheck preset colors so the
           custom color becomes active.
        */

        document
            .querySelectorAll(
                'input[name="letter-color"]'
            )
            .forEach((input) => {

                input.checked = false;

            });


        applyCustomColor();

    }
);


/* Themes */

document
    .querySelectorAll(
        'input[name="theme"]'
    )
    .forEach((input) => {

        input.addEventListener(
            "change",
            applySelectedTheme
        );

    });


/* Photo upload */

photoInput?.addEventListener(
    "change",
    handlePhotoUpload
);


/* Remove photo */

removePhotoButton?.addEventListener(
    "click",
    removePhoto
);


/* Download */

downloadButton?.addEventListener(
    "click",
    downloadLetter
);


/* ========================================
   CLEANUP
======================================== */

window.addEventListener(
    "beforeunload",
    () => {

        if (currentPhotoUrl) {

            URL.revokeObjectURL(
                currentPhotoUrl
            );

        }

    }
);


/* ========================================
   START
======================================== */

initializeLetter();