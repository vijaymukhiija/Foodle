// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/*  Global State of the App
** - Search Object
** - Current Recipe Object
** - Shopping List object
** - Likes object
*/
const state = {}



/*Search Controller*/

const searchController = async () => {
    //get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
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


/* Recipe Controller */
const recipeController = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe
            );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeController));


