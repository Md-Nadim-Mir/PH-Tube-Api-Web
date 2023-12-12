// Store sorted data for use across functions
let sort_data = [];

// Asynchronous function to load category names from the API
let dataLoad = async () => {

  // API endpoint
  let url = "https://openapi.programming-hero.com/api/videos/categories";

  // Fetching data from the API
  let res = await fetch(url);
  let data = await res.json();

  // Extracting the category names from the fetched data
  let categories_name = data.data;

  // Getting the HTML container for category names
  let categories_name_container = document.getElementById(
    "categories_name_container"
  );

  // Looping through each category name and appending it to the container
  categories_name.forEach((name) => {
    let div = document.createElement("div");
    div.innerHTML = `
        <button onclick="categories_data_load('${name.category_id}')"
        class="btn btn-ghoast text-black font-bold text-base focus:bg-[red]">${name.category}
        </button>`;
    categories_name_container.appendChild(div);
  });
};

// Asynchronous function to load video categories based on their ID

const categories_data_load = async (id) => {

  // API endpoint based on category ID

  let url = `https://openapi.programming-hero.com/api/videos/category/${id}`;

  // Fetching data from the API
  let res = await fetch(url);
  let data = await res.json();

  // Extracting the video categories from the fetched data
  let categories_data = data.data;

  // Storing the fetched data in the sort_data variable
  sort_data = data.data;

  // Getting the HTML container for video categories

  let categories_data_container = document.getElementById(
    "categories_data_container"
  );
  categories_data_container.innerHTML = "";

  // Getting the HTML container for an empty category message

  let empty_category = document.getElementById("empty_category");
  empty_category.innerHTML = "";

  // Checking if there are any video categories present

  if (categories_data.length > 0) {
    categories_data.forEach((details) => {
      // Generate and display video content based on the details
      generateVideoContent(details, categories_data_container);
    });
  } 
  
  else {
    // Display a message if no video categories are found

    let div = document.createElement("div");
    div.innerHTML = `
        <div class="flex items-center justify-center">
          <img class="pt-10 text-center" src="./images/Icon.png" alt="">
        </div>
        <h1 class="mt-10 text-center text-black font-extrabold text-2xl">Oops!! Sorry, There is no  <br> content here</h1>`;
    empty_category.appendChild(div);
  }
};

// Function to generate and display video content based on details

function generateVideoContent(details, container) {
  // Logic to calculate posted time in a readable format
  let sec = `${details.others.posted_date}`;
  let a;
  if (sec > 60 && sec < 86400) {
    let hour = Math.floor(sec / 3600);
    let minutes = Math.floor(sec / 60) % 60;
    a = hour + " hours " + minutes + " minutes ago";
  } else if (sec > 86400) {
    let year = Math.floor(sec / 31104000);
    a = year + " years ago";
  } else {
    a = "just now";
  }

  // Checking if the author is verified

  let verified = `${details.authors[0].verified}`;
  let icon = `<img src="./images/fi_10629607.svg" alt="">`;

  // Creating the HTML structure for the video content

  let div = document.createElement("div");
  div.innerHTML = `
        <!-- Video Card -->
        <div class="card w-full shadow-sm">
            <!-- Video Thumbnail -->
            <figure><img style="height:300px;" class="w-full rounded-sm" src="${
              details.thumbnail
            }" alt="Shoes" /></figure>
            
            <!-- Posted Time Label -->
            <span class=" text-xs text-white font-semibold text-end ml-24 mr-3 py-2 px-3 bg-[#312e2e] -mt-8 mb-5 rounded-2xl ">${a}</span>
            
            <!-- Video Details -->
            <div class="card-body">
                <!-- Author Thumbnail, Name, and Verification -->
                <div class="flex gap-4">
                    <!-- Author Thumbnail -->
                    <img style="height:40px;" class="rounded-full w-[15%]" src="${
                      details.authors[0].profile_picture
                    }" alt="">
                    <div>
                        <!-- Video Title -->
                        <h1 class="text-base font-extrabold text-black">${
                          details.title
                        }</h1>
                        
                        <!-- Author Name and Verification -->
                        <div class="flex gap-2 pt-1 pb-1">
                            <h1 class="text-sm font-bold">${
                              details.authors[0].profile_name
                            }</h1>
                            <p>${verified ? icon : ""}</p>  
                        </div>   
                        
                        <!-- Video Views -->
                        <h1 class="text-xs font-bold"><span>${
                          details.others.views
                        }</span> views</h1>
                    </div>
                </div>
            </div>
        </div>`;

  // Appending the video content to the container
  container.appendChild(div);
}

// Function to parse views and return them as numbers for sorting

function parseViews(viewsStr) {

  if (viewsStr.includes("K")) {
    return parseFloat(viewsStr.replace("K", "")) * 1000;
  } else if (viewsStr.includes("M")) {
    return parseFloat(viewsStr.replace("M", "")) * 1000000;
  } else {
    return parseFloat(viewsStr);
  }


}

// Event listener for the "sort_by_view" button
let sort_by_view = document.getElementById("sort_by_view");

sort_by_view.addEventListener("click", function () {
  // Sort the data based on views in descending order
  sort_data.sort(
    (a, b) => parseViews(b.others.views) - parseViews(a.others.views)
  );

  // Clear the container and regenerate the video content based on the sorted data
  const categories_data_container = document.getElementById(
    "categories_data_container"
  );
  categories_data_container.innerHTML = "";
  sort_data.forEach((details) => {
    generateVideoContent(details, categories_data_container);
  });
});

// Load video categories with a default ID of 1000
categories_data_load(1000);

// Load category names on page load
dataLoad();

// Event listener to redirect to another page on clicking the "blog" button
let blog = document.getElementById("blog");
blog.addEventListener("click", function () {
  window.location.href = "block.html";
});