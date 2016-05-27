/*global document */
'use strict';

import attributelist from './attributelist';

let currentIndex = 0,
    currentTitle = '',
    activeClassName = 'active',
    hash = location.hash.slice(1) || null,
    links = [].slice.call(document.querySelectorAll('.js-guide__link')),
    sections = [].slice.call(document.querySelectorAll('.js-guide__section')),
    incrementalNavHolder = document.querySelector('.js-guide__incremental'),
    incrementalNavData = {
        previous: {
            link: null,
            num: null,
            title: null
        },
        next: {
            link: null,
            num: null,
            title: null
        }
    };

let guide = () => {
    initialise();
    setVisibility();
    setAria();
    renderIncrementalNav();
};

let initialise = () => {
    //get initial state from hash, or set to default
    links.forEach((link, i) => {
        if(link.getAttribute('href').substr(1) === hash) {
            currentIndex = i;
            currentTitle = link.innerText;
        }
    });
    !currentTitle ? links[currentIndex].innerText : currentTitle;
};
//set current link from hash or default to first
let setVisibility = (previousIndex) => {
    console.log(previousIndex, currentIndex);
    if(previousIndex !== undefined) {
        links[previousIndex].classList.remove(activeClassName);
        sections[previousIndex].classList.remove(activeClassName);
    }
    links[currentIndex].classList.add(activeClassName);
    sections[currentIndex].classList.add(activeClassName);
    window.setTimeout(() => {window.scrollTo(0,0);}, 0);
}

//add ARIA to links - aria-selected, aria-controls
let setAria = () => {
    links.forEach((link, i) => {
        attributelist.set(link, {
            'aria-selected': currentIndex === i,
            'aria-controls': link.getAttribute('href').substr(1)
        });
    });
    
    //add ARIA to sections - aria-hidden
    sections.forEach((section, i) => {
        attributelist.set(section, {
            'aria-hidden': !(currentIndex === i)
        });
    });
};

let renderIncrementalNav = () => {
    let incrementalNav = '',
        getNavData = (i) => {
            return {
                link : links[i].href,
                num: i + 1,
                title: links[i].innerText
            }
        };
    
    //previous button
    if(currentIndex > 0) {
        incrementalNavData.previous = getNavData(currentIndex - 1);
        incrementalNav = `<a href="${incrementalNavData.previous.link}" rel="previous" class="js-guide__incremental--previous nav-incremental-link page-navigation__prev">
                <div class="nav-incremental__part">Part ${incrementalNavData.previous.num}</div>
                <div class="nav-incremental__title">${incrementalNavData.previous.title}</div>
            </div>`;
    }
    //next button
    if(currentIndex !== links.length - 1) {
        incrementalNavData.next = getNavData(currentIndex + 1);
        incrementalNav += `<a href="${incrementalNavData.next.link}" rel="next" class="js-guide__incremental--previous nav-incremental-link page-navigation__next">
                                <div class="nav-incremental__part">Part ${incrementalNavData.next.num}</div>
                                <div class="nav-incremental__title">${incrementalNavData.next.title}</div>
                            </a>`;
    }
    incrementalNavHolder.innerHTML = incrementalNav;
    
    bindEvents();
};

let bindEvents = () => {
    [].slice.call(document.querySelectorAll('.js-guide__incremental--previous, .js-guide__incremental--next, .js-guide__link')).forEach((btn) => {
        btn.addEventListener('click', change);
    });
};

let change = (e) => {
    e.preventDefault();
    let previousIndex = currentIndex;
    currentIndex = getNextIndex(`#${(e.target.parentNode.getAttribute('href') || e.target.getAttribute('href')).split('#')[1]}`);
    
    if(previousIndex === currentIndex) { return; }
    
    setVisibility(previousIndex);
    setAria();
    renderIncrementalNav();
    
    //window.location.hash = `#${(e.target.parentNode.getAttribute('href') || e.target.getAttribute('href')).split('#')[1]}`;
    window.history.pushState({ URL: `#${(e.target.parentNode.getAttribute('href') || e.target.getAttribute('href')).split('#')[1]}`}, '', `#${(e.target.parentNode.getAttribute('href') || e.target.getAttribute('href')).split('#')[1]}`);
};

let getNextIndex = (href) => {
    let index = null;
    links.forEach((link, i) => {
        if(link.getAttribute('href') === href) {
            index = i;
        }
    });
    return index;
};

export default guide;