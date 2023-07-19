import View from './view';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkupBtn(btnState, curBtn) {
    console.log('hi', btnState, curBtn);
    return `
    <button class="btn--inline pagination__btn--${btnState}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curBtn}</span>
          </button>
    `;
  }

  _generateMarkup() {
    console.log(this._data);
    const curPage = this._data.page;
    const nextBtn = curPage + 1;
    const prevBtn = curPage - 1;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages, 'noOfPages');
    // console.log(curPage - 1);

    //page 1 and there are otherpages
    if (curPage === 1 && numPages > 1) {
      console.log('pag1');
      return this._generateMarkupBtn('prev', nextBtn);

      //   return `
      //     <button class="btn--inline pagination__btn--prev">
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-left"></use>
      //         </svg>
      //         <span>Page ${curPage + 1}</span>
      //       </button>
      //     `;
      //   return 'Page 1, others';
    }
    //last page
    if (curPage === numPages && numPages > 1) {
      console.log('last page');
      return this._generateMarkupBtn('prev', prevBtn);
      //   return `
      //     <button class="btn--inline pagination__btn--prev">
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-left"></use>
      //         </svg>
      //         <span>Page ${curPage - 1}</span>
      //       </button>
      //     `;
      //   return 'last Page';
    }
    //Other page
    if (curPage < numPages) {
      console.log('Other page');
      //   this._generateMarkupBtn('next', nextBtn);
      //   this._generateMarkupBtn('prev', prevBtn);

      return `
          <button class="btn--inline pagination__btn--next">
          <span>Page ${curPage - 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        <button class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${curPage + 1}</span>
            </button>
          `;
      //   return 'other pages';
    }

    //page 1 and there are NO other pages
    return '';
    return 'only 1 page';
  }
}

export default new paginationView();
