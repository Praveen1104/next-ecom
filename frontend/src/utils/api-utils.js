/**
 * Utility functions for frontend API performance and interaction.
 */

/**
 * Debounce a function call.
 * Useful for search inputs to avoid hitting the API on every keystroke.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle a function call.
 * Useful for scroll/resize events.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - Limit time in milliseconds
 */
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Example of Lazy Loading / Infinite Scroll helper.
 * Returns an IntersectionObserver setup for a target element.
 */
export function createInfiniteScrollObserver(target, callback) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            callback();
        }
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
    });

    if (target) {
        observer.observe(target);
    }

    return observer;
}
