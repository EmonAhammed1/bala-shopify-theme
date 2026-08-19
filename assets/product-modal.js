(function() {
  if (customElements.get('product-modal')) return;

  class ProductModal extends HTMLElement {
    constructor() {
      super();
      const closeBtn = this.querySelector('[id^="ModalClose-"]') || this.querySelector('.product-media-modal__toggle');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.hide();
        });
      }
      this.addEventListener('keyup', (event) => {
        if (event.code && event.code.toUpperCase() === 'ESCAPE') this.hide();
      });
      this.addEventListener('click', (event) => {
        if (event.target === this || event.target.classList.contains('product-media-modal__dialog')) {
          this.hide();
        }
      });
    }

    isOpen() {
      return this.hasAttribute('open');
    }

    show(opener) {
      this.openedBy = opener;
      document.body.classList.add('overflow-hidden');
      this.setAttribute('open', '');
      this.showActiveMedia();
    }

    hide() {
      document.body.classList.remove('overflow-hidden');
      document.body.dispatchEvent(new CustomEvent('modalClosed'));
      this.removeAttribute('open');
    }

    showActiveMedia() {
      let mediaId = null;
      if (this.openedBy) {
        mediaId = this.openedBy.getAttribute('data-media-id') || 
                  (this.openedBy.dataset ? this.openedBy.dataset.mediaId : null);
        if (!mediaId) {
          const innerBtn = this.openedBy.querySelector('[data-media-id]');
          if (innerBtn) mediaId = innerBtn.getAttribute('data-media-id');
        }
      }

      if (!mediaId) {
        const firstMedia = this.querySelector('[data-media-id]');
        if (firstMedia) mediaId = firstMedia.getAttribute('data-media-id');
      }

      if (!mediaId) return;

      this.querySelectorAll('[data-media-id]').forEach((element) => {
        if (element.getAttribute('data-media-id') === mediaId) {
          element.classList.add('active');
          element.style.display = 'block';
          element.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        } else {
          element.classList.remove('active');
          element.style.display = 'none';
        }
      });

      const activeMedia = this.querySelector(`[data-media-id="${mediaId}"]`);
      if (!activeMedia) return;
      const activeMediaTemplate = activeMedia.querySelector('template');
      const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;

      const container = this.querySelector('[role="document"]');
      if (container && activeMedia.offsetWidth) {
        container.scrollLeft = (activeMedia.offsetWidth - container.clientWidth) / 2;
      }

      if (activeMedia.nodeName === 'DEFERRED-MEDIA' && activeMediaContent && activeMediaContent.querySelector('.js-youtube')) {
        if (typeof activeMedia.loadContent === 'function') activeMedia.loadContent();
      }
    }
  }

  customElements.define('product-modal', ProductModal);
})();
