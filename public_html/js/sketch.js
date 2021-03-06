/* Biblioteca de funcoes do micro framework, Sketch
 *
 * Marcelo Barbosa,
 * maio, 2017.
 */

// declaracao de variaveis globais
var toggleElements = null;
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
var eventType = "click";

// funcoes globais
function validarCNPJ(cnpj)
{
    // valida o cnpj de uma instituicao
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '')
        return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;
    return true;
}

function validarCPF(cpf)
{
    // valida cpf
    // declaracao de variaveis
    var Soma;
    var Resto;
    Soma = 0;

    // elimina os caracteres nao numericos
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf == "00000000000")
        return false;

    for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;
    if (Resto != parseInt(cpf.substring(9, 10)))
        return false;

    Soma = 0;
    for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;
    if (Resto != parseInt(cpf.substring(10, 11)))
        return false;
    return true;
}

function getEventByOperatingSystem()
{
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "touchstart";
    } else
    {
        return "click";
    }
}

// declaracao de funcoes
function cleanForm(idForm)
{
    // limpa os dados de campos/areas de texto e passwords de um formulario
    // declaracao de variaveis
    var inputTexts;
    var textArea;

    if (document.getElementById(idForm))
    {

        inputTexts = document.getElementsByTagName("INPUT");
        textArea = document.getElementsByTagName("TEXTAREA");

        for (var i = 0; i < inputTexts.length; i++)
        {

            if ((inputTexts[i].getAttribute("type") == "text") ||
                    (inputTexts[i].getAttribute("type") == "password") ||
                    (inputTexts[i].getAttribute("type") == "number"))
            {
                document.getElementById(inputTexts[i].getAttribute("id")).value = "";
            }
        }

        for (var i = 0; i < textArea.length; i++)
        {
            document.getElementById(textArea[i].getAttribute("id")).value = "";
        }
    }

}

function cleanField(id)
{
    // limpa um campo
    if (exist(id))
    {
        document.getElementById(id).value = "";
    }
}

function putContentInBlock(id, content)
{
    // insere um conteudo em um objeto
    if (exist(id))
    {
        var target = document.getElementById(id);
        target.innerHTML = content;
    }
}

function copyContentInBlockById(sourceId, targetId)
{
    // copia o conteudo de um objeto para outro via id
    if (exist(sourceId) && exist(targetId))
    {
        var source = document.getElementById(sourceId);
        var target = document.getElementById(targetId);

        target.innerHTML = source.innerHTML;
    }
}

function copyValueInBlockById(sourceId, targetId)
{
    // copia o conteudo de um campo de um objeto para outro via id
    if (exist(sourceId) && exist(targetId))
    {
        var source = document.getElementById(sourceId);
        var target = document.getElementById(targetId);

        target.innerHTML = source.value;
    }
}

function putContentInField(id, content)
{
    // insere um conteudo em um objeto
    if (exist(id))
    {
        var target = document.getElementById(id);
        target.value = content;
    }
}

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

function submitForm(id)
{
    // envia um formulario
    if (exist(id))
    {
        var form = document.getElementById(id);
        form.submit();
    }
}

function keyIsBackspace(event)
{
    var characterTyped = event.key;
    var keyCharacterTyped = event.code;

    var isBackspace = (characterTyped === "Backspace") || (keyCharacterTyped === "Backspace");

    if (isBackspace)
    {
        return true;
    } else
    {
        return false;
    }
}

function createMask(id, mask, event)
{
    // cria uma mascara para um dado campo
    if (exist(id))
    {
        var maskText = mask;
        var targetObject = document.getElementById(id);
        var text = targetObject.value;
        var formattedText = "";
        var position = text.length - 1;

        // seta o maxlength do campo
        if (targetObject.maxLength === -1)
        {
            targetObject.maxLength = mask.length;
        }

        // pega o texto corrente
        formattedText = text.substring(0, position);

        // concatena o valor com a mascara
        if (maskText.charAt(position) === "x")
        {
            formattedText = formattedText.concat(text.charAt(position));
        } else
        {
            if (!keyIsBackspace(event))
            {
                if (text.charAt(position) !== maskText.charAt(position))
                {
                    formattedText = formattedText.concat(maskText.charAt(position));
                }

                formattedText = formattedText.concat(text.charAt(position));
            } else
            {
                formattedText = formattedText.concat(text.charAt(position - 1));
            }

        }

        // colocando o valor obtido no campo referenciado
        targetObject.value = formattedText;
    }

}

function decimalBoundHandler(obj, decimalBound)
{
    var str = obj.value;
    if (str.indexOf(".") > -1)
    {
        // verifica se a quantidade de casas decimais estao dentro do limite
        var decimals = str.split(".");
        if (decimals[1].length > decimalBound)
        {
            str = str.substr(0, (str.indexOf(".") + decimalBound + 1));
        }

        obj.value = str;
    }

    if (str.indexOf(",") > -1)
    {
        // verifica se a quantidade de casas decimais estao dentro do limite
        var decimals = str.split(",");
        if (decimals[1].length > decimalBound)
        {
            str = str.substr(0, (str.indexOf(",") + decimalBound + 1));
        }

        obj.value = str;
    }
}

function numberFieldHandler(event, object)
{
    // controla um campo numerico
    // declaracao de variaveis
    var characterTyped = event.key;
    var keyCharacterTyped = event.code;
    var isNumber = (!isNaN(characterTyped)) && (characterTyped !== "Control");
    var isDot = (characterTyped === ".") || (characterTyped === ",");
    var isDirectional = (characterTyped === "ArrowLeft") || (characterTyped === "ArrowUp") || (characterTyped === "ArrowRight") || (characterTyped === "ArrowDown");
    var isDelete = (characterTyped === "Delete") || (keyCharacterTyped === "Delete") || (characterTyped === "Backspace") || (keyCharacterTyped === "Backspace");
    var isBackspace = event.code === "Backspace";
    var isEnd = characterTyped === "End";
    var isHome = characterTyped === "Home";
    var isCommand = characterTyped === "Control";
    var isTab = (characterTyped === "Tab") || (keyCharacterTyped === "Tab")
    var str = object.value;
    var hasComma = str.indexOf(",") > -1;
    var hasDot = str.indexOf(".") > -1;
    var hasSignal = hasComma || hasDot;

    // constroi a primeira premissa
    var firstStatement = isNumber || isDirectional || isDelete
            || isBackspace || isEnd || isHome || isCommand || isTab;

    // constroi a segunda premissa
    var secondStatement = !hasSignal && isDot;

    // variavel logica utilizada para indicar bloqueio ou liberação do caractere de entrada do usuario
    var status = false;

    // processamento logico das premissas
    if (firstStatement && !isDot)
    {
        status = true;
    } else
    {
        if (secondStatement)
        {
            status = true;
        }
    }


    // retorno de valor
    return status;
}

function validateLimit(begin, end, value)
{
    // avalia se um valor esta dentro de um limite 
    if ((value >= begin) && (value <= end))
    {
        return true;
    } else
    {
        return false;
    }
}

function isPositive(value)
{
    // verifica se um numero e positivo
    if (value >= 0)
    {
        return true;

    } else
    {
        return false;
    }

}

function isDate(value)
{
    // verifica se um valor e uma data valida
    var text = value;
    var day = parseInt(text.substring(0, 2));
    var month = parseInt(text.substring(3, 5));
    var year = parseInt(text.substring(6, 10));

    // montando proposicoes
    var isMonth28Days = ((day >= 1) && (day <= 28)) && (month === 2) && (year % 4 !== 0);

    var isMonth29Days = ((day >= 1) && (day <= 29)) && (month === 2) && (year % 4 === 0);

    var isMonth30Days = ((month === 4) || (month === 6) || (month === 9) ||
            (month === 11)) && ((day >= 1) && (day <= 30));

    var isMonth31Days = ((month === 1) || (month === 3) || (month === 5) ||
            (month === 7) || (month === 8) || (month === 10) ||
            (month === 12)) && ((day >= 1) && (day <= 31));


    // criando uma avaliacao das proposicoes
    var evaluate = (isMonth28Days || isMonth29Days || isMonth30Days || isMonth31Days);

    // retorno de valor
    return evaluate;

}

function isTime(value)
{
    // verifica se um valor e um horario valido
    var text = value;
    var hour = parseInt(text.substring(0, 2));
    var minute = parseInt(text.substring(3, 5));
    var second = parseInt(text.substring(6, 8));

    // montando proposicoes
    var isHour = ((hour >= 0) && (hour <= 23));
    var isMinute = ((minute >= 0) && (minute <= 59));
    var isSecond = ((second >= 0) && (second <= 59));

    // criando uma avaliacao das proposicoes
    var evaluate = (isHour && isMinute && isSecond);

    // retorno de valor
    return evaluate;

}

function getObject(id)
{
    // retorna a instancia de um objeto
    // declaracao de variaveis
    var obj = null;

    if (exist(id))
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

function showTabIndex(tabId, itemId)
{
    // visualiza uma area de conteudo do tab-index
    // declaracao de variaveis
    var tab = getObject(tabId);

    if (tab !== null)
    {
        var tabIndex = tab.getElementsByClassName("indexes")[0];
        var indexes = tabIndex.getElementsByTagName("LI");
        var tabContent = tab.getElementsByClassName("tab-content")[0];
        var content = tabContent.getElementsByClassName("content");

        for (i = 0; i < indexes.length; i++)
        {
            if (indexes[i].getAttribute("id") === itemId)
            {
                content[i].style.display = "block";
                indexes[i].classList.add("tab-displayed");
            } else
            {
                content[i].style.display = "none";
                indexes[i].classList.remove("tab-displayed");
            }
        }
    }
}

function openNavigator(id)
{
    // abre o navegador de recursos
    if (exist(id))
    {
        display(id, true);

        // anula o overflow do corpo do documento
        document.body.style.overflow = "hidden";
    }
}

function closeNavigator(id)
{
    // fecha o navegador de recursos
    if (exist(id))
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
    // estabiliza o menu dropdown mediante a largura da tela
    if (window.innerWidth > 480)
    {
        display("menu-icon", false);
        display("menu", true);
        display("menu-close-button", false);
        display("background-menu", false);
        display("menu-top-icon", false);

        // reseta o overflow do corpo do documento
        document.body.style.overflow = "auto";
    } else
    {
        if (!menuIsOpen)
        {
            display("menu-icon", true);
            display("menu", false);
        } else
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
    if ((window.pageYOffset !== 0) || (document.documentElement.scrollTop !== 0))
    {
        if (window.innerWidth > 480)
        {
            if (exist("top-icon"))
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

function moveImageByTouch(viewerId, imageListId, presentationId, event)
{
    // move a imagem pelo toque na tela
    // declaracao de variaveis
    var touchs = event.changedTouches[0];
    var halfOfScreen = window.innerWidth / 2;
    var target = event.target.parentNode;
    var targetChild = event.target;
    var buttonsClickeds = (target.getAttribute("id") === "prior-button")
            || (target.getAttribute("id") === "next-button")
            || (target.getAttribute("id") === "presentation-close-button")
            || (targetChild.getAttribute("id") === "prior-button")
            || (targetChild.getAttribute("id") === "next-button")
            || (targetChild.getAttribute("id") === "presentation-close-button");

    if (!buttonsClickeds)
    {
        if (touchs.pageX < halfOfScreen)
        {
            prior(viewerId, imageListId, presentationId);
        } else
        {
            next(viewerId, imageListId, presentationId);
        }
    }

}

function moveImage(viewerId, imageListId, presentationId, event)
{
    // move a imagem de acordo com a entrada do usuario
    var typePressed = null;

    if (imageViewIsOpen)
    {
        // declaracao de variaveis
        typePressed = event.which || event.keyCode;	// utiliza o atributo which caso seja um navegador Mozilla Firefox

        // seta para esquerda
        if (typePressed == 37)
        {
            // imagem anterior
            prior(viewerId, imageListId, presentationId);
        }

        // seta para cima
        if (typePressed == 38)
        {
            // ultima imagem
            var object = document.getElementById("image-item-" + imageViewLength);
            view(object, viewerId, imageListId, presentationId);
        }

        // seta para direita
        if (typePressed == 39)
        {
            // imagem posterior
            next(viewerId, imageListId, presentationId);
        }

        // seta para baixo
        if (typePressed == 40)
        {
            // primeira imagem
            var object = document.getElementById("image-item-1");
            view(object, viewerId, imageListId, presentationId);
        }
    }
}

function viewById(imageId, viewerId, imageListId, presentationId)
{
    // visualiza uma imagem por seu id
    if (exist(imageId))
    {
        var image = document.getElementById(imageId);
        view(image, viewerId, imageListId, presentationId);
    }
}

function view(object, viewerId, imageListId, presentationId)
{
    // visualiza imagens de uma lista
    if (object !== null)
    {
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
            if (exist("image-caption-" + imageIndex))
            {
                caption = document.getElementById("image-caption-" + imageIndex).innerHTML;
            } else
            {
                caption = "Foto " + imageIndex;
            }

            // exibe a legenda da imagem caso o elemento image-caption exista
            if (exist("image-caption"))
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
}

function playSlider(slider, time, index)
{
    // apresenta slides
    // obtem os sliders caso o vetor destes nao tenha sido inicializado
    slides = slider.getElementsByClassName("slide");

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
    window.setTimeout(function () {
        playSlider(slider, time, index);
    }, time);
}

function topLinkHandler()
{
    // gerencia os eventos do link de subida ao topo do site
    if ((window.pageYOffset === 0) || (document.documentElement.scrollTop === 0))
    {
        if (exist("top-icon"))
        {
            display("top-icon", false);
        }
    } else
    {
        if (window.innerWidth > 480)
        {
            if ((exist("top-icon")) && (!imageViewIsOpen))
            {
                display("top-icon", true);
            } else
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
    for (var i = 0; i < items.length; i++)
    {
        if (items[i].id !== "")
        {
            if (items[i].id !== obj.id)
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
    if (exist("slider-data"))
    {
        // obtem os sliders presentes na tela
        var arrayOfIds = JSON.parse(document.getElementById("slider-data").innerHTML);
        var slider = null;
        var time;
        for (var i = 0; i < arrayOfIds.length; i++)
        {
            if (exist(arrayOfIds[i].id))
            {
                slider = document.getElementById(arrayOfIds[i].id);
                time = Math.abs(parseInt(arrayOfIds[i].time));
                playSlider(slider, time, 0);
            }
        }

    }
}

function initImageViewer()
{
    // inicializa os eventos do visualizador de imagens
    if (exist("presentation-configuration"))
    {
        // obtem os sliders presentes na tela
        var configuration = JSON.parse(document.getElementById("presentation-configuration").innerHTML);

        document.body.addEventListener("keyup", function () {
            moveImage(configuration.viewerId, configuration.listPrefixId, configuration.presentationId, event);
        });

    }
}

function handleMainMenuByEvent(event, mustBeClosed)
{
    // controla a nevegacao dos sub-menus pelo menu drop-down por meio de toque/clique 
    // declaracao de variaveis
    var obj = event.target;
    var submenu = obj.parentNode.getElementsByTagName("UL")[0];

    if (submenu !== undefined)
    {
        // verifica se o objeto possui id                
        if (submenu.getAttribute("id") !== null)
        {
            var strId = submenu.id;

            if (strId.search("sub-menu-") > -1)
            {
                if ((submenu.style.display === "none") || (submenu.style.display === ""))
                {
                    submenu.style.display = "block";
                    if (mustBeClosed)
                    {
                        hideSubMenu(submenu);
                    }
                } else
                {
                    submenu.style.display = "none";
                    submenu.removeAttribute("style");
                }
            }
        }

    }
}

function addToggleElement(id)
{
    // adiciona um elemento ao array de elementos
    toggleElements[id] = true;
}

function toggle(id, status)
{
    // ativa o efeito de show/hide para elementos
    if (exist(id))
    {

        if (toggleElements === null)
        {
            toggleElements = [];
        }

        if (toggleElements[id] === undefined)
        {
            addToggleElement(id);
            toggleElements[id] = status;
        }

        if (toggleElements[id] === true)
        {
            show(id);
            toggleElements[id] = false;
        } else
        {
            hide(id);
            toggleElements[id] = true;
        }
    }
}

// ----> listeners
window.addEventListener("resize", function () {
    estabilishMenu();
});
window.addEventListener("load", function () {
    initSliders();
    initImageViewer();
});

window.addEventListener("scroll", function () {
    topLinkHandler();
});

window.addEventListener(getEventByOperatingSystem(), function (event) {
    if (getEventByOperatingSystem() === "touchstart")
    {
        handleMainMenuByEvent(event, false);
    } else
    {
        handleMainMenuByEvent(event, true);
    }
});