// Global app controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

/*  Global State of the App
** - Search Object
** - Current Recipe Object
** - Shopping List object
** - Likes object
*/
const state = {}

const searchController = async () => {
    //get query from view
    const query = searchView.getInput();

    if (query) {
        //new search object and add to state
        state.search = new Search(query);

        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //Search query 
        await state.search.getResults();

        //Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }

}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchController();
});

elements.searchResPages.addEventListener('click', e => {
    //closet method will help to select only the the selected element even if events happened in near/child elements
    const btn = e.target.closest('.btn-inline');        
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);  //Uses data attribute to fetch which we've to go from markup
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});