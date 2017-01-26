// pages.js
//
// Manages the hiding and showing of elements to give the appearance of having
// multiple pages on the website.
//
// (c) 2017 ScottyLabs

// The page map holds selectors for the elements that should be hidden or shown
// for the desired page
var pageMap = {
    "main": ["#accent-frame", ".static-center.container", ".page-button"],
    "faq": ["#faq", ".logo.accent-logo", ".back-button"]
};


// Set a default page before making page navigation buttons available, to
// prevent races
var currentPage = 'main';

// Add a back button that is only visible from modal pages
$('<a>',{
    text: 'X',
    title: 'back',
    href: '#',
    class: 'back-button uppercase',
    click: function() { displayModal("main"); }
}).hide().appendTo('body > .back-button-wrapper');


// hidePage - removes all elements of the given page with the desired duration
var hidePage = function(page, duration) {
    if (!pageMap.hasOwnProperty(page)) {
        console.error("Page " + page + " not found");
        return;
    }
    pageMap[page].forEach(function(selector) {
        $(selector).hide(duration);
    });
}

// showPage - shows all elements of the given page with the desired duration
var showPage = function(page, duration) {
    if (!pageMap.hasOwnProperty(page)) {
        console.error("Page " + page + " not found");
        return;
    }
    pageMap[page].forEach(function(selector) {
        $(selector).show(duration);
    });
}

// displayModal - Creates a modal view of the desired page, hiding all other
// pages. timeOut and timeIn specify how long hiding old pages and showing new
// pages should take, respectively.
var displayModal = function(page, timeOut, timeIn) {
    if (!pageMap.hasOwnProperty(page)) {
        console.error("Page " + page + " not found");
        return;
    }
    for (var otherPage in pageMap) {
        if (otherPage != page) {
            hidePage(otherPage, timeOut);
        }
    }
    showPage(page);
}

// Hard-coded FAQ example
$('<a>',{
    text: 'F.A.Q.',
    title: 'faq',
    href: '#',
    class: 'page-button uppercase',
    click: function() { displayModal("faq"); }
}).appendTo('body > .page-button-wrapper');

