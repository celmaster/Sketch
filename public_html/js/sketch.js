/* Biblioteca de funcoes do micro framework, Sketch
 *
 * Marcelo Barbosa,
 * maio, 2017.
 */

// declaracao de variaveis globais
var imageViewLength = null;
var imageViewPrior = null;
var imageViewNext = null;
var imageViewIsOpen = false;
var sliderTime = 0;
var sliderIndex = 0;
var position = 1;
var sliderGroup = null;
var sliders = null;
var menuIsOpen = false;

// funcoes globais

// declaracao de funcoes
function exist(id)
{
    // verifica se o id de um elemento existe
    if (document.getElementById(id))
    {
        return true;
    } else
        {
            return false;
        }
}

function getObject(id)
{
    // retorna a instancia de um objeto
    // declaracao de variaveis
    var obj = null;
    
    if(exist(id))
    {
        obj = document.getElementById(id);
    }
    
    // retorno de valor
    return obj;
}

function display(id, isVisible)
{
    // oculta ou exibe um elemento
    if (exist(id))
    {
        // obtem a instancia do objeto
        var object = document.getElementById(id);

        if (isVisible)
        {
            object.style.display = "block";
        } else
        {
            object.style.display = "none";
        }
    }
}

function show(id)
{
   // torna um elemento visivel
   display(id, true);   
}

function hide(id)
{
   // torna um elemento invisivel   
   display(id, false);   
}

function openNavigator(id)
{
    // abre o navegador de recursos
    if(exist(id))
    {
        display(id, true);
        
        // anula o overflow do corpo do documento
        document.body.style.overflow = "hidden";
    }
}

function closeNavigator(id)
{
    // fecha o navegador de recursos
    if(exist(id))
    {
        display(id, false);
        
        // reseta o overflow do corpo do documento
        document.body.style.overflow = "auto";
    }
}

function closeMenu()
{
    // fecha o menu de uma aplicacao
    display("menu-icon", true);
    display("menu-close-button", false);
    display("background-menu", false);
    display("menu", false);
    display("menu-top-icon", false);

    // altera o valor da variavel logica
    menuIsOpen = false;

    // reseta o overflow do corpo do documento
    document.body.style.overflow = "auto";
}

function openMenu()
{
    // abre o menu de uma aplicacao
    display("menu-icon", false);
    display("menu-close-button", true);
    display("background-menu", true);
    display("menu", true);
    display("menu-top-icon", true);

    // altera o valor da variavel logica
    menuIsOpen = true;

    // anula o overflow do corpo do documento
    document.body.style.overflow = "hidden";

}

function estabilishMenu()
{
    // estabiliza o menu dropdown
    if (window.innerWidth > 480)
    {
        display("menu-icon", false);
        display("menu", true);
        display("menu-close-button", false);
        display("background-menu", false);
        display("menu-top-icon", false);

        // reseta o overflow do corpo do documento
        document.body.style.overflow = "auto";
    }else
        {
            if (!menuIsOpen)
            {
                display("menu-icon", true);
                display("menu", false);
            }else
                {
                    openMenu();
                }
                
            display("top-icon", false);    
        }
}

function navLink(id)
{
    // faz navegacao de conteudo por id   
    // realiza a navegacao
    window.location.href = "#" + id;
}

function navPage(page)
{
    // faz navegacao de conteudo por pagina
    // realiza a navegacao
    window.location.href = page;
}

function initImageViewLength(imageListId)
{
    // inicializa a variavel
    if (exist(imageListId))
    {
        var divs = document.getElementById(imageListId).getElementsByTagName("div");
        imageViewLength = divs.length;
    }
}

function noQuote(str)
{
    // remove aspas
    while (str.search("\"") > -1)
    {
        str = str.replace("\"", "");
    }

    return str;
}

function closePresentation(presentationId)
{
    // fecha a apresentacao de imagens
    display(presentationId, false);
	
	// altera o valor da variavel logica indicando que o visualizador de imagens esta fechado
	imageViewIsOpen = false;

    // reseta o overflow do corpo do documento
    document.body.style.overflow = "auto";
    
    // faz o top-icon ficar visivel caso a scrollbar tenha sido ativada
    if((window.pageYOffset !== 0) || (document.documentElement.scrollTop !== 0))
    {
        if (window.innerWidth > 480)
        {
            if(exist("top-icon"))
            {          
                display("top-icon", true);
            }
        }
    }
}

function setImageViewPrior(index)
{
    imageViewPrior = index;
}

function setImageViewNext(index)
{
    imageViewNext = index;
}

function showPresentationNavButtons()
{
    // exibe os botoes de navegacao na tela de apresentacao de imagens
    if (imageViewPrior > 0)
    {
        display("prior-button", true);
    } else
        {
            display("prior-button", false);
        }

    if (imageViewNext <= imageViewLength)
    {
        display("next-button", true);
    } else
        {
            display("next-button", false);
        }
}

function prior(viewerId, imageListId, presentationId)
{
    // navega para a imagem antecedente
    var object = document.getElementById("image-item-" + imageViewPrior);

    view(object, viewerId, imageListId, presentationId);
}

function next(viewerId, imageListId, presentationId)
{
    // navega para a imagem sucessora
    var object = document.getElementById("image-item-" + imageViewNext);

    view(object, viewerId, imageListId, presentationId);
}

function viewById(imageId, viewerId, imageListId, presentationId)
{
    // visualiza uma imagem por seu id
    if(exist(imageId))
    {
        var image = document.getElementById(imageId);
        view(image, viewerId, imageListId, presentationId);
    }
}

function view(object, viewerId, imageListId, presentationId)
{
    // visualiza imagens de uma lista
    // verifica se a variavel de quantidade de imagens foi inicializada
    if (imageViewLength === null)
    {
        initImageViewLength(imageListId);
    }

    // verifica se o id do visualizador existe
    if (exist(viewerId) && exist(presentationId))
    {
        // anula o overflow do corpo do documento
        document.body.style.overflow = "hidden";
		
		// armazena a descricao da imagem
		var caption = "";
		
		// obtem o indice da imagem para navegar para outras imagens
		var imageIndex = parseInt(object.id.substring(object.id.lastIndexOf("-") + 1));
		setImageViewPrior(imageIndex - 1);
		setImageViewNext(imageIndex + 1);
		
		//verifica se a descricao da imagem foi dada pelo desenvolvedor/designer
		if(exist("image-caption-"+imageIndex))
		{
			caption = document.getElementById("image-caption-"+imageIndex).innerHTML;
		}else
			{
				caption = "Foto " + imageIndex;
			}
        
        // exibe a legenda da imagem caso o elemento image-caption exista
        if(exist("image-caption"))
        {
            document.getElementById("image-caption").innerText = caption;
        }

        // obtem a instancia do objeto img que ira atuar como visualizador
        var viewer = document.getElementById(viewerId);

        // obtem o url da imagem a ser visualizada
        var imageURL = object.style.backgroundImage;

        // fixa a imagem no objeto visualizador
        viewer.src = noQuote(imageURL.substring(4, (imageURL.length - 1)));

        // exibe o apresentador
        display(presentationId, true);

        // exibe os navegadores
        showPresentationNavButtons();
        
        // faz o top-icon ficar oculto
        display("top-icon", false);
		
		// altera o valor da variavel logica indicando que o visualizador de imagens esta aberto
		imageViewIsOpen = true;
    }
}

function playSlider(slider, time, index)
{
    // apresenta slides
    // obtem os sliders caso o vetor destes nao tenha sido inicializado
    slides = slider.getElementsByClassName("slider");					
    
    for (var i = 0; i < slides.length; i++)
	{
		slides[i].style.display = "none";
	}
	
	slides[index].style.display = "block";


	if (index < (slides.length - 1))
	{
		index++;
	} else
		{
			index = 0;
		}			
		

	// executa a apresentacao com chamadas recursivas    
	window.setTimeout(function(){playSlider(slider, time, index);}, time);
}

function topLinkHandler()
{
    // gerencia os eventos do link de subida ao topo do site
    if((window.pageYOffset === 0) || (document.documentElement.scrollTop === 0))
    {
        if(exist("top-icon"))
        {          
            display("top-icon", false);
        }
    }else
        {
            if (window.innerWidth > 480)
            {
              if((exist("top-icon")) && (!imageViewIsOpen))
              {              
                 display("top-icon", true);              
              }else
                  {
                      display("top-icon", false);
                  }
            }
        }
}

function hideSubMenu(obj)
{
    // exibe o sub-menu
    // declaração de variaveis
    var menu = document.getElementById("menu-items");
    var items = menu.getElementsByTagName("UL");
    for(var i = 0; i < items.length; i++)
    {
        if(items[i].id !== "")
        {
            if(items[i].id !== obj.id)
            {
               items[i].style.display = "none";
               items[i].removeAttribute("style");
            }
        }
    }
}

function initSliders()
{
	// inicializa todos os sliders
	if(exist("slider-data"))
	{
		// obtem os sliders presentes na tela
		var arrayOfIds = JSON.parse(document.getElementById("slider-data").innerHTML);
		var slider = null;
		var time;
		for(var i = 0; i < arrayOfIds.length; i++)
		{
			if(exist(arrayOfIds[i].id))
			{
				slider = document.getElementById(arrayOfIds[i].id);	
				time = Math.abs(parseInt(arrayOfIds[i].time));
				playSlider(slider, time, 0);
			}	
		}		
		
	}
}

function handleMainMenuByEvent(event)
{
	// controla a nevegacao dos sub-menus pelo menu drop-down por meio de toque/clique 
    // declaracao de variaveis
    var obj = event.target;    
    var submenu = obj.parentNode.getElementsByTagName("UL")[0];

    if(submenu !== null)
    {
        var strId = submenu.id;

        if(strId.search("sub-menu-") > -1)
        {
            if((submenu.style.display === "none") || (submenu.style.display === ""))
            {
                submenu.style.display = "block";
                hideSubMenu(submenu);            
            }else
                {
                    submenu.style.display = "none";
                    submenu.removeAttribute("style");
                }				
        }

    }
}

// ----> listeners
window.addEventListener("resize", function (){
    estabilishMenu();
});
window.addEventListener("load", function (){
	initSliders();
});

window.addEventListener("scroll", function(){
	topLinkHandler();
});

window.addEventListener("click", function(event){
	handleMainMenuByEvent(event);
});

// ----> threads