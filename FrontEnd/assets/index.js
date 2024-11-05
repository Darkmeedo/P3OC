
// Fonction asynchrone pour récupérer les photos dans l'API
async function getWorks() {
	const response = await fetch('http://localhost:5678/api/works', { cache: "no-store" });
	return response.json();
}

// Fonction asynchrone pour récupérer les catégories des photos dans l'API
async function getCategories() {
	const response = await fetch('http://localhost:5678/api/categories');
	return response.json();
}

// Fonction asynchrone pour supprimer des travaux dans l'API
async function deleteWork(workId) {
	const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`
		}
	});
	return response;
}

// Création des galleries pour la page d'accueil et la modale
function createWorkGallery(works, categoryId) {
	if (categoryId === undefined) {
		categoryId = 0;
	}

	const galleryContainer = document.getElementById('gallery');
	galleryContainer.innerHTML = "";

	const modaleGalleryContainer = document.getElementById('picGallery');
	modaleGalleryContainer.innerHTML = "";

	if (categoryId != 0) {
		works = works.filter(work => categoryId == work.categoryId);
	}

	for (let i in works) {
		let figureNode = document.createElement('figure');
		let imgNode = document.createElement('img');
		imgNode.setAttribute('src', works[i].imageUrl);
		imgNode.setAttribute('alt', works[i].title);

		let figCaptionNode = document.createElement('figcaption');
		let figcaptionTextNode = document.createTextNode(works[i].title);

		figCaptionNode.appendChild(figcaptionTextNode);
		figureNode.appendChild(imgNode);
		figureNode.appendChild(figCaptionNode);
		galleryContainer.appendChild(figureNode);

		let modaleFigureNode = document.createElement('figure');
		modaleFigureNode.classList.add('modale-figure');

		let modaleImgNode = document.createElement('img');
		modaleImgNode.setAttribute('src', works[i].imageUrl);
		modaleImgNode.setAttribute('alt', works[i].title);

		let trashIcon = document.createElement('i');
		trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');

		trashIcon.dataset.workId = works[i].id;

		modaleFigureNode.appendChild(modaleImgNode);
		modaleFigureNode.appendChild(trashIcon);
		modaleGalleryContainer.appendChild(modaleFigureNode);
	}

	document.querySelectorAll('.trash-icon').forEach(function(i) {
		i.addEventListener('click', function(e) {
			const workId = e.target.dataset.workId;
			deleteWork(workId).then(function(response) {
				if (204 !== response.status) {
					alert('Une erreur est survenue, veuillez réessayer');
				} else {
					getWorks().then(works => createWorkGallery(works));
					alert('Suppression réussie du projet');
				}
			});
		});
	});
}

// Création de la div "portfolio"
function createStructure() {
	const portfolio = document.getElementById('portfolio');

	const h2Node = document.createElement('h2');
	const h2TextNode = document.createTextNode('Mes Projets');
	h2Node.appendChild(h2TextNode);

	const btnModifier = document.createElement('div');
	btnModifier.setAttribute('id', 'modifier');
	btnModifier.appendChild(h2Node);
	portfolio.appendChild(btnModifier);

	const categoriesContainer = document.createElement('div');
	categoriesContainer.setAttribute('class', 'category');
	categoriesContainer.setAttribute('id', 'category');
	portfolio.appendChild(categoriesContainer);

	const galleryContainer = document.createElement('div');
	galleryContainer.setAttribute('class', 'gallery');
	galleryContainer.setAttribute('id', 'gallery');
	portfolio.appendChild(galleryContainer);
}

// Delog depuis la page d'accueil
function logout() {
	localStorage.removeItem('loggedIn');
	window.location.href = "index.html";
}
document.getElementById('logout').addEventListener('click', function(e) {
	e.preventDefault();
	logout();
});

function userIsLoggedIn() {
	const logged = localStorage.getItem('loggedIn');

	if (logged == 'true') {
		document.getElementById('menu').classList.add('logged');
		const modifierContainer = document.getElementById('modifier');

		const modaleOpener = document.createElement('a');
		modaleOpener.setAttribute('id', 'edit');
		modaleOpener.setAttribute('href', '#');

		const modifierIcon = document.createElement('i');
		modifierIcon.setAttribute('class', 'fa-sharp fa-solid fa-pen-to-square');

		const modifierTxt = document.createTextNode('Modifier');

		modaleOpener.appendChild(modifierIcon);
		modaleOpener.appendChild(modifierTxt);

		modaleOpener.addEventListener('click', function(e) {
			e.preventDefault();
			openModale('modaleP1');
		});

		modifierContainer.appendChild(modaleOpener);

		document.getElementById('edition').classList.add('visible');

		initModale();
		getCategories().then(function(categories) {
			const selector = document.getElementById('newPicCategory');
			categories.forEach(function(category) {
				let option = document.createElement('option');
				let textNode = document.createTextNode(category.name);
				option.value = category.id;

				option.appendChild(textNode);
				selector.appendChild(option);
			});
		});
	} else {
		getCategories().then(categories => createCategories(categories));
	}
}

function initModale() {
	const closeButtons = document.querySelectorAll('.close-icon i');
	for (let closeButton of closeButtons) {
		closeButton.addEventListener('click', function() {
			hideAllModale();
		});
	}
	const closeWrappers = document.querySelectorAll('.modale');
	for (let closeWrapper of closeWrappers) {
		closeWrapper.addEventListener('click', function(e) {
			if (e.target.classList.contains('modale')) {
				hideAllModale();
			}
		});
	}
}

function hideAllModale() {
	document.querySelectorAll('.modale').forEach(m => m.classList.add('hidden'));
}

function openModale(modaleId) {
	hideAllModale();
	resetForm(); // Ajout de la réinitialisation du formulaire
	document.getElementById(modaleId).classList.remove('hidden');
}

// Fonction pour réinitialiser le formulaire
function resetForm() {
	document.getElementById('champ-text').value = ''; 
	document.getElementById('newPicCategory').selectedIndex = 0; 
	document.getElementById('input-file').value = ''; 
	document.getElementById('preview-img').src = ''; 
	document.getElementById('image-preview').style.display = 'none'; 
	document.querySelectorAll('.hide-on-drag-load').forEach(function(element) {
		element.style.display = 'block';
	});
	updateSubmit(); 
}

function modaleNavigationEvents() {
	const addpicbtn = document.getElementById('addpicbtn');

	addpicbtn.addEventListener('click', function() {
		openModale('modaleP2');
	});

	const returnArrow = document.getElementById('return-arrow');
	returnArrow.addEventListener('click', function() {
		openModale('modaleP1');
	});
}

function main() {
	createStructure();
	getWorks().then(works => createWorkGallery(works));
	userIsLoggedIn();
	modaleNavigationEvents();
}

// Création des boutons filtre en mode visiteur
function createCategories(categories) {
	const categoriesContainer = document.getElementById('category');

	const allButton = {
		id: 0,
		name: 'Tous'
	};

	categories = [allButton].concat(categories);

	for (let i in categories) {
		let buttonNode = document.createElement('button');

		buttonNode.dataset.category = categories[i].id;
		buttonNode.className = 'filterButton';

		let buttonTextNode = document.createTextNode(categories[i].name);
		buttonNode.appendChild(buttonTextNode);
		buttonNode.addEventListener('click', function(e) {
			getWorks().then(works => createWorkGallery(works, e.target.dataset.category));
		});
		categoriesContainer.appendChild(buttonNode);
	}
}

// Drop Area - Drag n drop
const dragNDropArea = document.getElementById('dragNDropArea');
const inputFile = document.getElementById('input-file');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');

dragNDropArea.addEventListener('dragover', (event) => {
	event.preventDefault();
	dragNDropArea.classList.add('drag-over');
});

dragNDropArea.addEventListener('dragleave', () => {
	dragNDropArea.classList.remove('drag-over');
});

dragNDropArea.addEventListener('drop', (event) => {
	event.preventDefault();
	dragNDropArea.classList.remove('drag-over');

	const files = event.dataTransfer.files;
	handleFiles(files);
});

inputFile.addEventListener('change', (event) => {
	const files = event.target.files;
	handleFiles(files);
});

// Fonction pour traiter les fichiers et afficher l'aperçu
function handleFiles(files) {
	const file = files[0];
	if (file && file.type.startsWith('image/')) {
		const reader = new FileReader();

		reader.onload = (e) => {
			previewImg.src = e.target.result;
			imagePreview.style.display = 'block';

			document.querySelectorAll('.hide-on-drag-load').forEach(function(element) {
				element.style.display = 'none';
			});

			// Mettre à jour le champ inputFile pour que checkForm puisse détecter l'image
			inputFile.files = files;

			updateSubmit();
		};

		reader.readAsDataURL(file);
	} else {
		alert('Veuillez sélectionner une image valide.');
	}
}

// Fonction pour afficher l'aperçu de l'image
function previewImage(file) {
	const reader = new FileReader();
	reader.onload = function(e) {
		const previewImg = document.getElementById('preview-img');
		previewImg.src = e.target.result;

		// Affiche l'aperçu de l'image
		document.getElementById('image-preview').style.display = 'block';

		// Cache les éléments de la modale au chargement de l'aperçu
		document.querySelectorAll('.hide-on-drag-load').forEach(function(e) {
			e.classList.add('hidden');
		});
	};
	reader.readAsDataURL(file);

	// Actualise l'état du bouton de validation
	updateSubmit();
}

async function uploadImage(file) {
	const formData = new FormData();
	formData.append("image", file);
	formData.append("title", document.getElementById('champ-text').value);
	formData.append("category", document.getElementById('newPicCategory').value);

	const response = await fetch('http://localhost:5678/api/works', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`
		},
		body: formData
	});

	if (response.ok) {
		const newWork = await response.json();
		await refreshGallery();
		alert('projet ajouté avec succès');
		hideAllModale();
	} else {
		alert("Une erreur s'est produite lors de l'upload.");
	}
}

function checkForm(withDebug) {
	const champText = document.getElementById('champ-text');
	if (champText.value.length < 1) {
		if (withDebug) { alert("Veuillez indiquer un titre."); }
		return false;
	}

	const newPicCategory = document.getElementById('newPicCategory');
	if (!newPicCategory.selectedIndex) {
		if (withDebug) { alert("Veuillez sélectionner une catégorie."); }
		return false;
	}

	// Vérifier si une image est présente dans l'aperçu
	const previewImg = document.getElementById('preview-img');
	if (!previewImg.src) {
		if (withDebug) { alert("Veuillez sélectionner une image."); }
		return false;
	}

	return true;
}

function updateSubmit() {
	const submitBtn = document.getElementById('validate-btn');
	if (checkForm(false)) {
		submitBtn.classList.remove('disabled');
	} else {
		submitBtn.classList.add('disabled');
	}
}
document.getElementById('champ-text').addEventListener('change', updateSubmit);
document.getElementById('newPicCategory').addEventListener('change', updateSubmit);

document.querySelector('.validate-btn').addEventListener('click', function() {
	if (checkForm(true)) {
		const inputFile = document.getElementById('input-file');
		uploadImage(inputFile.files[0]);
	}
});

async function refreshGallery() {
	const works = await getWorks();
	createWorkGallery(works);
}

// Formulaire de contact
document.addEventListener("DOMContentLoaded", function() {
	const form = document.querySelector("#contact form");
	const inputs = document.querySelectorAll("#contact input, #contact textarea");
	const submitBtn = document.querySelector('#contact input[type="submit"]');

	// Désactiver le bouton au chargement de la page
	submitBtn.classList.add("disabled");
	submitBtn.disabled = true;

	// Fonction pour vérifier si tous les champs sont remplis
	function checkFormFields() {
		let allFilled = true;
		inputs.forEach(input => {
			if (input.value.trim() === "") {
				allFilled = false;
			}
		});

		if (allFilled) {
			submitBtn.classList.remove("disabled");
			submitBtn.disabled = false;
		} else {
			submitBtn.classList.add("disabled");
			submitBtn.disabled = true;
		}
	}

	// Ajouter un écouteur d'événement à chaque champ pour vérifier les entrées
	inputs.forEach(input => {
		input.addEventListener("input", checkFormFields);
	});

	// Écouteur pour la soumission du formulaire
	form.addEventListener("submit", function(event) {
		event.preventDefault();

		// Vérification des champs directement dans l'événement de soumission
		const name = document.getElementById("name").value.trim();
		const email = document.getElementById("email").value.trim();
		const message = document.getElementById("message").value.trim();

		if (!name || !email || !message) {
			alert("Veuillez remplir tous les champs.");
			return;
		}

		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		if (!emailPattern.test(email)) {
			alert("Veuillez entrer une adresse email valide.");
			return;
		}

		sendEmail(name, email, message);

		// Réinitialiser les champs et désactiver le bouton après soumission
		document.getElementById("name").value = "";
		document.getElementById("email").value = "";
		document.getElementById("message").value = "";
		submitBtn.classList.add("disabled");
		submitBtn.disabled = true;
	});

	// Fonction pour envoyer l'email
	function sendEmail(name, email, message) {
		const mailtoLink = `mailto:antoinelefevreoc@gmail.com?subject=Nouveau message de ${encodeURIComponent(name)}&body=${encodeURIComponent("Nom : " + name + "\nEmail : " + email + "\n\nMessage : " + message)}`;
		window.location.href = mailtoLink;
	}
});

main();
