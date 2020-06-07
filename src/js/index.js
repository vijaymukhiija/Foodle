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
})