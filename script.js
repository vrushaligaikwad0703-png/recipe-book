// Enhanced Recipe Book Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const recipeForm = document.getElementById('recipe-form');
    const recipeNameInput = document.getElementById('recipe-name');
    const recipeImageInput = document.getElementById('recipe-image');
    const recipeIngredientsInput = document.getElementById('recipe-ingredients');
    const recipeStepsInput = document.getElementById('recipe-steps');
    const recipeTimeInput = document.getElementById('recipe-time');
    const recipeCategoryInput = document.getElementById('recipe-category');
    const recipeFavoriteInput = document.getElementById('recipe-favorite');
    const recipeVegetarianInput = document.getElementById('recipe-vegetarian');
    const recipesContainer = document.getElementById('recipes-container');
    const noRecipesMessage = document.getElementById('no-recipes');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResultCount = document.getElementById('search-result-count');
    const totalRecipesHeader = document.getElementById('total-recipes-header');
    const totalTimeElement = document.getElementById('total-time');
    const favoriteCountElement = document.getElementById('favorite-count');
    const clearFormBtn = document.getElementById('clear-form');
    const importSampleBtn = document.getElementById('import-sample');
    const addSampleRecipesBtn = document.getElementById('add-sample-recipes');
    const recipeModal = document.getElementById('recipe-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const currentYearSpan = document.getElementById('current-year');
    const exportRecipesBtn = document.getElementById('export-recipes');
    const deleteAllBtn = document.getElementById('delete-all');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const toggleFavoritesBtn = document.getElementById('toggle-favorites');
    const formatIngredientsBtn = document.getElementById('format-ingredients');
    const formatStepsBtn = document.getElementById('format-steps');
    
    // Filter elements
    const filterCategory = document.getElementById('filter-category');
    const filterTime = document.getElementById('filter-time');
    const sortBy = document.getElementById('sort-by');
    
    // Modal elements
    const toggleFavoriteModalBtn = document.getElementById('toggle-favorite-modal');
    const editRecipeBtn = document.getElementById('edit-recipe');
    const deleteRecipeModalBtn = document.getElementById('delete-recipe-modal');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');
    const confirmMessage = document.getElementById('confirm-message');
    
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    // State variables
    let recipes = [];
    let currentRecipeId = null;
    let confirmAction = null;
    let showFavoritesOnly = false;
    let currentFilters = {
        category: 'all',
        maxTime: 0,
        search: '',
        sortBy: 'newest'
    };
    
    // Sample recipes data
    const sampleRecipes = [
        {
            id: 1,
            name: "Classic Pancakes",
            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            ingredients: [
                "1 cup all-purpose flour",
                "2 tablespoons sugar",
                "2 teaspoons baking powder",
                "1/2 teaspoon salt",
                "1 cup milk",
                "1 large egg",
                "2 tablespoons melted butter",
                "1 teaspoon vanilla extract"
            ],
            steps: [
                "In a bowl, mix together the flour, sugar, baking powder, and salt.",
                "In another bowl, whisk together milk, egg, melted butter, and vanilla.",
                "Pour the wet ingredients into the dry ingredients and stir until just combined.",
                "Heat a non-stick pan over medium heat and lightly grease with butter.",
                "Pour 1/4 cup of batter onto the pan for each pancake.",
                "Cook until bubbles form on the surface, then flip and cook until golden brown.",
                "Serve warm with maple syrup and fresh berries."
            ],
            time: 20,
            category: "breakfast",
            favorite: true,
            vegetarian: true,
            dateAdded: "2023-10-15"
        },
        {
            id: 2,
            name: "Vegetable Stir Fry",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            ingredients: [
                "2 cups broccoli florets",
                "1 red bell pepper, sliced",
                "1 carrot, julienned",
                "1 cup snap peas",
                "2 cloves garlic, minced",
                "1 tablespoon ginger, grated",
                "3 tablespoons soy sauce",
                "1 tablespoon sesame oil",
                "1 tablespoon honey",
                "2 green onions, chopped"
            ],
            steps: [
                "Heat sesame oil in a large wok or skillet over high heat.",
                "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
                "Add carrots and stir-fry for 2 minutes.",
                "Add broccoli, bell pepper, and snap peas. Stir-fry for 4-5 minutes.",
                "In a small bowl, mix soy sauce and honey.",
                "Pour sauce over vegetables and toss to coat.",
                "Cook for 1 more minute, then garnish with green onions.",
                "Serve over rice or noodles."
            ],
            time: 25,
            category: "dinner",
            favorite: false,
            vegetarian: true,
            dateAdded: "2023-10-10"
        },
        {
            id: 3,
            name: "Chocolate Chip Cookies",
            image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            ingredients: [
                "2 1/4 cups all-purpose flour",
                "1 teaspoon baking soda",
                "1 teaspoon salt",
                "1 cup unsalted butter, softened",
                "3/4 cup granulated sugar",
                "3/4 cup packed brown sugar",
                "2 large eggs",
                "2 teaspoons vanilla extract",
                "2 cups semisweet chocolate chips"
            ],
            steps: [
                "Preheat oven to 375°F (190°C).",
                "In a small bowl, combine flour, baking soda, and salt.",
                "In a large bowl, beat butter and sugars until creamy.",
                "Add eggs one at a time, beating well after each addition.",
                "Beat in vanilla extract.",
                "Gradually add flour mixture, mixing just until combined.",
                "Stir in chocolate chips.",
                "Drop by rounded tablespoons onto ungreased baking sheets.",
                "Bake for 9-11 minutes or until golden brown.",
                "Cool on baking sheets for 2 minutes before removing to wire racks."
            ],
            time: 45,
            category: "dessert",
            favorite: true,
            vegetarian: true,
            dateAdded: "2023-10-05"
        }
    ];
    
    // Load recipes from localStorage
    function loadRecipes() {
        const savedRecipes = localStorage.getItem('recipeBook');
        if (savedRecipes) {
            recipes = JSON.parse(savedRecipes);
        } else {
            recipes = [...sampleRecipes];
            saveRecipes();
        }
        
        updateStats();
        applyFiltersAndDisplay();
    }
    
    // Save recipes to localStorage
    function saveRecipes() {
        localStorage.setItem('recipeBook', JSON.stringify(recipes));
        updateStats();
    }
    
    // Update statistics
    function updateStats() {
        totalRecipesHeader.textContent = recipes.length;
        
        const totalTime = recipes.reduce((sum, recipe) => sum + (recipe.time || 0), 0);
        totalTimeElement.textContent = totalTime;
        
        const favoriteCount = recipes.filter(recipe => recipe.favorite).length;
        favoriteCountElement.textContent = favoriteCount;
    }
    
    // Apply filters and display recipes
    function applyFiltersAndDisplay() {
        let filteredRecipes = [...recipes];
        
        // Apply favorites filter
        if (showFavoritesOnly) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.favorite);
        }
        
        // Apply category filter
        if (currentFilters.category !== 'all') {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === currentFilters.category);
        }
        
        // Apply time filter
        if (currentFilters.maxTime > 0) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.time <= currentFilters.maxTime);
        }
        
        // Apply search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.name.toLowerCase().includes(searchTerm) ||
                recipe.ingredients.some(ingredient => 
                    ingredient.toLowerCase().includes(searchTerm)
                ) ||
                recipe.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply sorting
        switch(currentFilters.sortBy) {
            case 'newest':
                filteredRecipes.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'oldest':
                filteredRecipes.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
                break;
            case 'name':
                filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'time':
                filteredRecipes.sort((a, b) => (a.time || 0) - (b.time || 0));
                break;
        }
        
        displayRecipes(filteredRecipes);
    }
    
    // Display recipes in the container
    function displayRecipes(recipesToDisplay) {
        recipesContainer.innerHTML = '';
        
        if (recipesToDisplay.length === 0) {
            noRecipesMessage.style.display = 'block';
            searchResultCount.textContent = showFavoritesOnly 
                ? 'No favorite recipes found.' 
                : 'No recipes found matching your criteria.';
            return;
        }
        
        noRecipesMessage.style.display = 'none';
        
        recipesToDisplay.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.dataset.id = recipe.id;
            
            // Create badges
            let badges = '';
            if (recipe.favorite) {
                badges += '<span class="recipe-badge favorite"><i class="fas fa-star"></i> Favorite</span>';
            }
            if (recipe.vegetarian) {
                badges += '<span class="recipe-badge vegetarian"><i class="fas fa-leaf"></i> Vegetarian</span>';
            }
            
            // Limit ingredients preview
            const ingredientsPreview = recipe.ingredients.slice(0, 3).map(ing => ing.split(',')[0]).join(', ') + 
                                      (recipe.ingredients.length > 3 ? '...' : '');
            
            recipeCard.innerHTML = `
                ${badges}
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-content">
                    <div class="recipe-title">
                        <span>${recipe.name}</span>
                        <button class="recipe-favorite-btn" onclick="event.stopPropagation(); toggleFavorite(${recipe.id})">
                            <i class="${recipe.favorite ? 'fas' : 'far'} fa-star"></i>
                        </button>
                    </div>
                    <p class="recipe-ingredients-preview">${ingredientsPreview}</p>
                    <div class="recipe-meta">
                        <span class="recipe-time">
                            <i class="fas fa-clock"></i> ${recipe.time || 'N/A'} min
                        </span>
                        <span class="recipe-category">
                            <i class="fas fa-tag"></i> ${recipe.category}
                        </span>
                    </div>
                    <div class="recipe-actions-bar">
                        <button class="btn btn-info" onclick="event.stopPropagation(); openRecipeModal(${recipe.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-warning" onclick="event.stopPropagation(); toggleFavorite(${recipe.id})">
                            <i class="${recipe.favorite ? 'fas' : 'far'} fa-star"></i>
                        </button>
                        <button class="btn btn-danger" onclick="event.stopPropagation(); confirmDeleteRecipe(${recipe.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            
            recipeCard.addEventListener('click', () => openRecipeModal(recipe.id));
            recipesContainer.appendChild(recipeCard);
        });
        
        // Update search result count
        let resultText = `Showing ${recipesToDisplay.length} recipe${recipesToDisplay.length !== 1 ? 's' : ''}`;
        if (showFavoritesOnly) resultText += ' (Favorites)';
        if (currentFilters.search) resultText += ` matching "${currentFilters.search}"`;
        searchResultCount.textContent = resultText;
    }
    
    // Open recipe modal
    function openRecipeModal(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        currentRecipeId = recipeId;
        
        // Update modal content
        document.getElementById('modal-recipe-title').textContent = recipe.name;
        document.getElementById('modal-recipe-image').src = recipe.image;
        document.getElementById('modal-recipe-image').alt = recipe.name;
        document.getElementById('modal-recipe-time').textContent = recipe.time || 'N/A';
        document.getElementById('modal-recipe-ingredient-count').textContent = recipe.ingredients.length;
        document.getElementById('modal-recipe-category').textContent = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);
        
        // Update badges
        const badgesContainer = document.getElementById('modal-recipe-badges');
        badgesContainer.innerHTML = '';
        if (recipe.favorite) {
            const badge = document.createElement('span');
            badge.className = 'modal-badge';
            badge.innerHTML = '<i class="fas fa-star"></i> Favorite';
            badgesContainer.appendChild(badge);
        }
        if (recipe.vegetarian) {
            const badge = document.createElement('span');
            badge.className = 'modal-badge';
            badge.innerHTML = '<i class="fas fa-leaf"></i> Vegetarian';
            badgesContainer.appendChild(badge);
        }
        
        // Update ingredients
        const ingredientsList = document.getElementById('modal-recipe-ingredients');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        // Update steps
        const stepsList = document.getElementById('modal-recipe-steps');
        stepsList.innerHTML = '';
        recipe.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
        
        // Update favorite button
        const favoriteBtn = document.getElementById('toggle-favorite-modal');
        const starIcon = favoriteBtn.querySelector('i');
        const spanText = favoriteBtn.querySelector('span');
        
        if (recipe.favorite) {
            starIcon.className = 'fas fa-star';
            spanText.textContent = 'Remove from Favorites';
        } else {
            starIcon.className = 'far fa-star';
            spanText.textContent = 'Add to Favorites';
        }
        
        // Show modal
        recipeModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close recipe modal
    function closeRecipeModal() {
        recipeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentRecipeId = null;
    }
    
    // Close confirmation modal
    function closeConfirmModal() {
        confirmModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        confirmAction = null;
    }
    
    // Generate unique ID for recipes
    function generateId() {
        return recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
    }
    
    // Toggle favorite status
    function toggleFavorite(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            recipe.favorite = !recipe.favorite;
            saveRecipes();
            applyFiltersAndDisplay();
            
            // If modal is open for this recipe, update it
            if (currentRecipeId === recipeId && recipeModal.style.display === 'block') {
                openRecipeModal(recipeId);
            }
        }
    }
    
    // Confirm delete recipe
    function confirmDeleteRecipe(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        confirmMessage.textContent = `Are you sure you want to delete "${recipe.name}"?`;
        confirmAction = () => deleteRecipe(recipeId);
        confirmModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Delete recipe
    function deleteRecipe(recipeId) {
        recipes = recipes.filter(r => r.id !== recipeId);
        saveRecipes();
        applyFiltersAndDisplay();
        closeConfirmModal();
        
        // If modal was open, close it
        if (currentRecipeId === recipeId) {
            closeRecipeModal();
        }
    }
    
    // Delete all recipes
    function deleteAllRecipes() {
        if (recipes.length === 0) return;
        
        confirmMessage.textContent = `Are you sure you want to delete all ${recipes.length} recipes? This action cannot be undone.`;
        confirmAction = () => {
            recipes = [];
            saveRecipes();
            applyFiltersAndDisplay();
            closeConfirmModal();
        };
        confirmModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Export recipes
    function exportRecipes() {
        const dataStr = JSON.stringify(recipes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `recipe-book-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert(`Exported ${recipes.length} recipes successfully!`);
    }
    
    // Import sample recipes
    function addSampleRecipes() {
        const newSampleRecipes = sampleRecipes.map(recipe => ({
            ...recipe,
            id: generateId(),
            dateAdded: new Date().toISOString().split('T')[0]
        }));
        
        recipes.push(...newSampleRecipes);
        saveRecipes();
        applyFiltersAndDisplay();
        
        alert(`Added ${newSampleRecipes.length} sample recipes to your collection!`);
    }
    
    // Format text with bullet points
    function formatWithBullets(text) {
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.startsWith('-') ? line : `- ${line}`)
            .join('\n');
    }
    
    // Format text with numbers
    function formatWithNumbers(text) {
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => line.match(/^\d+\./) ? line : `${index + 1}. ${line}`)
            .join('\n');
    }
    
    // Event Listeners
    recipeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!recipeNameInput.value.trim() || 
            !recipeIngredientsInput.value.trim() || 
            !recipeStepsInput.value.trim()) {
            alert('Please fill in all required fields: Recipe Name, Ingredients, and Preparation Steps.');
            return;
        }
        
        // Create new recipe object
        const newRecipe = {
            id: generateId(),
            name: recipeNameInput.value.trim(),
            image: recipeImageInput.value.trim() || "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ingredients: recipeIngredientsInput.value.trim().split('\n').filter(item => item.trim()),
            steps: recipeStepsInput.value.trim().split('\n').filter(step => step.trim()),
            time: parseInt(recipeTimeInput.value) || 30,
            category: recipeCategoryInput.value,
            favorite: recipeFavoriteInput.checked,
            vegetarian: recipeVegetarianInput.checked,
            dateAdded: new Date().toISOString().split('T')[0]
        };
        
        // Add to recipes array
        recipes.push(newRecipe);
        
        // Save to localStorage
        saveRecipes();
        
        // Display updated recipes
        applyFiltersAndDisplay();
        
        // Reset form
        recipeForm.reset();
        recipeCategoryInput.value = 'dinner';
        recipeTimeInput.value = '30';
        recipeImageInput.value = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
        recipeFavoriteInput.checked = true;
        
        // Show success message
        alert(`"${newRecipe.name}" has been added to your Recipe Book!`);
    });
    
    // Clear form button
    clearFormBtn.addEventListener('click', function() {
        recipeForm.reset();
        recipeCategoryInput.value = 'dinner';
        recipeTimeInput.value = '30';
        recipeImageInput.value = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
        recipeFavoriteInput.checked = true;
    });
    
    // Import sample button
    importSampleBtn.addEventListener('click', function() {
        const sampleRecipe = {
            id: generateId(),
            name: "Quick Tomato Pasta",
            image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ingredients: [
                "200g pasta",
                "2 tablespoons olive oil",
                "2 cloves garlic, minced",
                "1 can crushed tomatoes",
                "1 teaspoon dried basil",
                "Salt and pepper to taste",
                "Fresh basil for garnish",
                "Grated parmesan cheese"
            ],
            steps: [
                "Cook pasta according to package instructions.",
                "Heat olive oil in a pan over medium heat.",
                "Add garlic and cook until fragrant, about 1 minute.",
                "Add crushed tomatoes and dried basil. Simmer for 10 minutes.",
                "Season with salt and pepper.",
                "Drain pasta and add to the sauce. Toss to combine.",
                "Serve with fresh basil and grated parmesan."
            ],
            time: 20,
            category: "dinner",
            favorite: false,
            vegetarian: true,
            dateAdded: new Date().toISOString().split('T')[0]
        };
        
        recipes.push(sampleRecipe);
        saveRecipes();
        applyFiltersAndDisplay();
        
        // Fill form with sample data
        recipeNameInput.value = sampleRecipe.name;
        recipeImageInput.value = sampleRecipe.image;
        recipeIngredientsInput.value = sampleRecipe.ingredients.join('\n');
        recipeStepsInput.value = sampleRecipe.steps.join('\n');
        recipeTimeInput.value = sampleRecipe.time;
        recipeCategoryInput.value = sampleRecipe.category;
        recipeFavoriteInput.checked = sampleRecipe.favorite;
        recipeVegetarianInput.checked = sampleRecipe.vegetarian;
        
        alert('Sample recipe added! You can edit it or save as is.');
    });
    
    // Add sample recipes button
    addSampleRecipesBtn.addEventListener('click', addSampleRecipes);
    
    // Search functionality
    function searchRecipes() {
        currentFilters.search = searchInput.value.trim();
        applyFiltersAndDisplay();
    }
    
    searchBtn.addEventListener('click', searchRecipes);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        currentFilters.category = filterCategory.value;
        currentFilters.maxTime = parseInt(filterTime.value);
        currentFilters.sortBy = sortBy.value;
        applyFiltersAndDisplay();
    });
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterCategory.value = 'all';
        filterTime.value = '0';
        sortBy.value = 'newest';
        showFavoritesOnly = false;
        toggleFavoritesBtn.innerHTML = '<i class="fas fa-star"></i> Show Favorites';
        
        currentFilters = {
            category: 'all',
            maxTime: 0,
            search: '',
            sortBy: 'newest'
        };
        
        applyFiltersAndDisplay();
    });
    
    // Toggle favorites
    toggleFavoritesBtn.addEventListener('click', function() {
        showFavoritesOnly = !showFavoritesOnly;
        toggleFavoritesBtn.innerHTML = showFavoritesOnly 
            ? '<i class="fas fa-star"></i> Show All' 
            : '<i class="fas fa-star"></i> Show Favorites';
        applyFiltersAndDisplay();
    });
    
    // Export recipes
    exportRecipesBtn.addEventListener('click', exportRecipes);
    
    // Delete all recipes
    deleteAllBtn.addEventListener('click', deleteAllRecipes);
    
    // Format ingredients button
    formatIngredientsBtn.addEventListener('click', function() {
        recipeIngredientsInput.value = formatWithBullets(recipeIngredientsInput.value);
    });
    
    // Format steps button
    formatStepsBtn.addEventListener('click', function() {
        recipeStepsInput.value = formatWithNumbers(recipeStepsInput.value);
    });
    
    // Modal event listeners
    toggleFavoriteModalBtn.addEventListener('click', function() {
        if (currentRecipeId) {
            toggleFavorite(currentRecipeId);
        }
    });
    
    editRecipeBtn.addEventListener('click', function() {
        if (currentRecipeId) {
            const recipe = recipes.find(r => r.id === currentRecipeId);
            if (recipe) {
                // Fill form with recipe data
                recipeNameInput.value = recipe.name;
                recipeImageInput.value = recipe.image;
                recipeIngredientsInput.value = recipe.ingredients.join('\n');
                recipeStepsInput.value = recipe.steps.join('\n');
                recipeTimeInput.value = recipe.time || 30;
                recipeCategoryInput.value = recipe.category;
                recipeFavoriteInput.checked = recipe.favorite;
                recipeVegetarianInput.checked = recipe.vegetarian || false;
                
                // Delete the old recipe
                recipes = recipes.filter(r => r.id !== currentRecipeId);
                saveRecipes();
                
                closeRecipeModal();
                alert('Recipe loaded into form for editing. Make your changes and save.');
            }
        }
    });
    
    deleteRecipeModalBtn.addEventListener('click', function() {
        if (currentRecipeId) {
            confirmDeleteRecipe(currentRecipeId);
        }
    });
    
    // Confirmation modal buttons
    confirmYesBtn.addEventListener('click', function() {
        if (confirmAction) {
            confirmAction();
        }
    });
    
    confirmNoBtn.addEventListener('click', closeConfirmModal);
    
    // Close modals when clicking X or close button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeRecipeModal();
            closeConfirmModal();
        });
    });
    
    // Close modal when clicking outside
    recipeModal.addEventListener('click', function(e) {
        if (e.target === recipeModal) {
            closeRecipeModal();
        }
    });
    
    confirmModal.addEventListener('click', function(e) {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (recipeModal.style.display === 'block') {
                closeRecipeModal();
            }
            if (confirmModal.style.display === 'block') {
                closeConfirmModal();
            }
        }
    });
    
    // Initialize the app
    loadRecipes();
    
    // Make functions available globally for onclick events
    window.openRecipeModal = openRecipeModal;
    window.toggleFavorite = toggleFavorite;
    window.confirmDeleteRecipe = confirmDeleteRecipe;
});