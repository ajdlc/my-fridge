/**
 * Data Object
 */
let data = {
    title: "My Fridge",
    recipeSearch: "",
    recipes: [],
    images: []
};

/**
 * Vue Instance
 */
let vm = new Vue({
    data,
    vuetify: new Vuetify(),
    methods: {
        searchRecipes() {
            // Clear previous search if it exists
            this.recipes = [];
            this.images = [];
            
            // To use the Vue instance in other functions
            let self = this;
            // Edamam Recipe Request
            let request = new XMLHttpRequest();
            request.open("GET", `https://api.edamam.com/search?q=${this.recipeSearch}&app_id=${edamamId}&app_key=${edamamKey}&to=5`);

            // Set the response type
            request.responseType = "json";

            request.send();

            // Wait for the response
            request.onload = function() {
                console.log(request.response.hits);

                // Response manipulation
                for (let i = 0; i < request.response.hits.length; i++) {
                    // Get the recipe from the returned data object
                    let r = request.response.hits[i].recipe;

                    let temp = {
                        name: r.label,
                        url: r.shareAs,
                        time: r.totalTime,
                        ingredients: r.ingredientLines
                    };

                    // Store in Vue Data Object
                    self.recipes.push(temp);
                }

                // After Edamam, we are going to search Unsplash
                let url = new URL("https://api.unsplash.com/search/photos");
                // client_id = access key
                url.searchParams.set("client_id", unsplash);
                url.searchParams.set("query", self.recipeSearch);
                url.searchParams.set("per_page", 5);

                let req2 = new XMLHttpRequest();
                req2.open("GET", url);
                req2.responseType = "json";
                req2.send()

                req2.onload = function() {
                    console.log(req2.response.results);

                    // Response manipulation
                    req2.response.results.forEach(item => {
                        let temp = {
                            title: item.description,
                            alt: item.alt_description,
                            url: item.urls.small
                        }

                        // Store in Vue Data Object
                        self.images.push(temp);
                    })
                }
            }

        }
    }
}).$mount("#app");