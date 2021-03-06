"use strict";

(function () {

var BiblioCard = React.createClass({
    onClick: function (e) {
	e.preventDefault();
	this.props.handleClickCard({"alias" : this.props.alias});
    },
    onDragStart: function (e) {
	e.dataTransfer.setData("text", JSON.stringify({"type": "card", 
						       "from": "biblio",
						       "alias": this.props.alias}));
    },
    render: function () {
	var alt = "Image de la carte : " + this.props.card.name,
	    img = "img?name=" + this.props.alias + "." + this.props.card.imgExt;
	return (
	    <li className="biblioCard" onClick={this.onClick} >
 		<img src={img} title={this.props.card.name} alt={alt} 
                onDragStart={this.onDragStart} draggable={true} />
	    </li>
	);
    }
});

var BiblioList = React.createClass({
    render: function () {
	var cards = this.props.cards.lists.tri.map(function (alias, index) {
	    var card = this.props.cards.set[alias];
	    return (
		<BiblioCard key={index} alias={alias} card={card} 
                            handleClickCard={this.props.handleClickCard} />
	    );
	}.bind(this));
	return (
	    <ul className="biblioList" >
	        {cards}
	    </ul>
	);
    }				
});

var BiblioAdd = React.createClass({
    onCardSubmit: function (e) {
	e.preventDefault();
	
	var url = this.refs.url.getDOMNode().value.trim();
	if (! url) { return; }
	
	this.props.handleCardSubmit({url:url});
	this.refs.url.getDOMNode().value = "";
	return;
    },
    onFillClick: function (e) {
	e.preventDefault();
	this.refs.url.getDOMNode().focus();
	this.refs.url.getDOMNode().value = "http://yugioh.wikia.com/wiki/";
    },
    render: function () {
	return (
	    <form className="biblioAdd" onSubmit={this.onCardSubmit} >
		<input type="button" onClick={this.onFillClick} value="@" />
	        <input type="text" ref="url" placeholder="URL de la carte" />
		<input type="submit" value="Ajouter" /> <br />
	    </form>
	);
    }				
});

var BiblioCardDelZone = React.createClass({
    onDragOver: function (e) {
	e.preventDefault();
    },
    onDrop: function (e) {
	e.preventDefault();
	
	var data;
	try { data = JSON.parse(e.dataTransfer.getData("text")); }
	catch (err) {}

	if (! data) { return; }
	if (data.type != "card") { return; }

	this.props.handleCardDel(data.alias);
    },
    render: function () {
	return (
	    <h3 className="biblioCardDelZone" title="Déposez des cartes dans cette zone"
	        onDragOver={this.onDragOver} onDrop={this.onDrop} >
		<span>Supprimer<br />une carte</span>
	    </h3>
	);
    }
});

var BiblioBox = React.createClass({
    render: function () {
	return (
	    <div className="biblioBox" >
		<h2>Bibliothèque</h2>
		<BiblioList cards={this.props.cards} 
                            handleClickCard = {this.props.handleClickCard} />
		<h3>Ajouter une carte</h3>
		<BiblioAdd handleCardSubmit={this.props.handleCardSubmit} />
		<BiblioCardDelZone handleCardDel={this.props.handleCardDel} />
		<p>
		<strong>Aide : </strong> <br />
		<span>Il faut utiliser les URL du site </span>
	        <a href="http://yugioh.wikia.com/wiki/Category:Duel_Monsters_cards" >yugioh.wikia.com</a> 
		<span>.</span> <br /> 
                <span>par exemple "<a href="http://yugioh.wikia.com/wiki/Lucky_Chance" >http://yugioh.wikia.com/wiki/Lucky_Chance</a>".</span>
		</p>
	    </div>
	);
    }
});

var DeckInList = React.createClass({
    onDragOver: function (e) {
	e.preventDefault();
    },
    onDrop: function (e) {
	e.preventDefault();

	var data;
	try { data = JSON.parse(e.dataTransfer.getData("text")); }
	catch (err) {}

	if (! data) { return; }
	if (data.type != "card") { return; }
	
	this.props.handleDeckAddCard(this.props.alias, data.alias);
    },
    onClick: function (e) {
	e.preventDefault();
	this.props.handleDeckSelection(this.props.alias);
    },
    onDragStart: function (e) {
	e.dataTransfer.setData("text", JSON.stringify({"type": "deck", 
						       "alias": this.props.alias}));
    },
    render: function () {
	return (
	    <li className="deckInList" onDragOver={this.onDragOver} 
                onDrop={this.onDrop} onClick={this.onClick} onDragStart={this.onDragStart} 
		draggable={true} >
		<span>{this.props.deck.name} ({this.props.deck.nbcards})</span>
	    </li>
	);
    }
});

var DecksList = React.createClass({
    render: function () {
	var decks = this.props.decks.list.map((function (alias, index) {
	    var deck = this.props.decks.set[alias];
	    return (
		<DeckInList key={index} alias={alias} deck={deck} 
		            handleDeckAddCard={this.props.handleDeckAddCard} 
		            handleDeckSelection={this.props.handleDeckSelection} />
	    );
	}).bind(this));
	return (
	    <ul className="decksList" >{decks}</ul>
	);
    }
});

var DeckDropCardZone = React.createClass({
    onDragOver: function (e) {
	e.preventDefault();
    },
    onDrop: function (e) {
	e.preventDefault();

	var data;
	try { data = JSON.parse(e.dataTransfer.getData("text")); }
	catch (err) {}

	if (! data) { return; }
	if (data.type != "card" || data.from != "deck") { return; }

	this.props.handleDeckDropCard(data.deck, data.alias);
    },
    render: function () {
	return (
	    <h3 className="deckDropCardZone" onDragOver={this.onDragOver} 
		onDrop={this.onDrop} title="Déposez des cartes dans cette zone" >
		<span>Enlever<br />une carte</span>
	    </h3>
	);
    }
});

var DeckCard = React.createClass({
    onClick: function (e) {
	e.preventDefault();
	this.props.handleClickCard({"alias" : this.props.alias});
    },
    onDragStart: function (e) {
	e.dataTransfer.setData("text", JSON.stringify({"type": "card",
						       "from": "deck",
						       "alias": this.props.alias,
						       "deck":  this.props.deckAlias}));
    },
    render: function () {
	var alt = "Image de la carte : " + this.props.card.name,
	    img = "img?name=" + this.props.alias + "." + this.props.card.imgExt;
	return (
	    <li className="deckCard" onClick={this.onClick} >
 		<img src={img} title={this.props.card.name} alt={alt} 
                onDragStart={this.onDragStart} />
	    </li>
	);
    }
});

var DeckShow = React.createClass({
    render: function () {
	if (this.props.deck) { 
	    var cards = this.props.deck.cards.tri.map(function (alias, index) {
		var card = this.props.cards.set[alias];
		return (
		    <DeckCard key={index} alias={alias} deckAlias={this.props.alias} 
		              card={card} index={index} 
                              handleClickCard={this.props.handleClickCard} />
		);
	    }.bind(this));
	    return (
		<ul className="deckShow" >
		    <h3>{this.props.deck.name}</h3>
	            {cards}
		</ul>
	    );
	}
	else { return (<ul className="deckShow" ></ul>); }
    }
});

var DecksAddForm = React.createClass({
    onDecksAddSubmit: function (e) {
	e.preventDefault();
	var name = this.refs.name.getDOMNode().value.trim();
	if (! name) { return; }
	
	this.props.handleDecksAddSubmit({name: name});
	this.refs.name.getDOMNode().value = "";	
    },
    render: function () {
	return (
	    <div className="decksAddForm" >
		<h3>Créer un deck</h3>
		<form onSubmit={this.onDecksAddSubmit} >
		    <input type="text" ref="name" placeholder="nom du deck" />
	            <input type="submit" value="Créer" />
		</form>
		
	    </div>
	);
    }
});

var DeckDelZone = React.createClass({
    onDragOver: function (e) {
	e.preventDefault();
    },
    onDrop: function (e) {
	e.preventDefault();
	// TODO : Ajouter un DIALOG de confirmation
	var data;
	try { data = JSON.parse(e.dataTransfer.getData("text")); }
	catch (err) {}

	if (! data) { return; }
	if (data.type != "deck") { return; }

	this.props.handleDeckDel(data.alias);
    },
    render: function () {
	return (
	    <h3 className="deckDelZone" onDragOver={this.onDragOver} onDrop={this.onDrop} 
		title="Déposez des cartes dans cette zone" >
		<span>Supprimer<br />un deck</span>
	    </h3>
	);
    }
});

var DecksBox = React.createClass({
    render: function () {
	var deck = this.props.decks.set[this.props.deckShow];
	return (
	    <div className="decksBox" >
		<h2>Decks</h2>
		<DecksList decks={this.props.decks} 
		           handleDeckAddCard={this.props.handleDeckAddCard} 
		           handleDeckSelection={this.props.handleDeckSelection} />
		<DeckDropCardZone handleDeckDropCard={this.props.handleDeckDropCard} />
		<DeckShow deck={deck} alias={this.props.deckShow} cards={this.props.cards}
		          handleClickCard={this.props.handleClickCard} />
		<DecksAddForm handleDecksAddSubmit={this.props.handleDecksAddSubmit} />
		<DeckDelZone handleDeckDel={this.props.handleDeckDel} />
		<p>
		  <strong>Aide : </strong>
		  <span>Il faut glisser-déposer les cartes depuis la bibliothèque
	                jusqu{"'"}au nom du deck dans la liste. La plupart des actions se
                        font par glisser-déposer.</span>
	        </p>
	    </div>
	);
    }
});

var CardInfoBox = React.createClass({
    onDragStart: function (e) {
	e.dataTransfer.setData("text", JSON.stringify({"type": "card", 
						       "from": "cardinfo",
						       "alias": this.props.alias}));
    },
    render: function () {
	if (this.props.alias == "") {
	    return (
	        <div className="cardInfoBox" >
		    <h2>Carte Infos</h2>
		</div>
	    );
	}
	var alt = "Image de la carte : " + this.props.card.name,
	    img = "img?name=" + this.props.alias + "." + this.props.card.imgExt;
	return (
	    <div className="cardInfoBox" >
		<h2>Carte Infos</h2>
		<img src={img} title={this.props.card.name} alt={alt} 
		     onDragStart={this.onDragStart} draggable={true} />
	    </div>
	)
    }
});

var DoroBox = React.createClass({
    loadData: function () {
	$.ajax({
	    url: this.props.urlData,
	    dataType: "json",
	    success: function (data) {
		this.setState({cards: data.biblio, decks: data.decks});
	    }.bind(this),
	    error: function (xhr, status, err) {
		console.error(this.props.urlData, status, err.toString());
	    }.bind(this)
	});
    },
    handleCardSubmit: function (card) {
	$.ajax({
	    isLocal: true,
	    url: this.props.urlBiblioAdd,
	    data: card,
	    dataType: "json",
	    type: "GET",
	    success: function (data) {
		this.setState({cards: data});
	    }.bind(this),
	    error: function (xhr, status, err) {
		console.error(this.props.urlBiblioAdd, status, err.toString());
	    }.bind(this)
	});
    },
    handleClickCard: function (card) {
	if (card.alias in this.state.cards.set) {
	    this.setState({cardInfo: {
		alias: card.alias,
		card: this.state.cards.set[card.alias]
	    }});
	}
    },
    handleDecksAddSubmit: function (deck) {
	$.ajax({
	    isLocal: true,
	    url: this.props.urlDecksAdd,
	    data: deck,
	    dataType: "json",
	    type: "GET",
	    success: function (data) {
		this.setState({decks: data});
	    }.bind(this),
	    error: function (xhr, status, err) {
		console.error(this.props.urlDecksAdd, status, err.toString());
	    }.bind(this)
	});
    },
    handleDeckAddCard: function (deck, card) {
	$.ajax({
	    url: this.props.urlDeckAddCard,
	    data: {deck: deck, card: card},
	    dataType: "json",
	    type: "GET",
	    success: function (data) {
		this.setState({decks: data});
	    }.bind(this),
	    error: function (xhr, status, err) {
		console.error(this.props.urlDeckAddCard, status, err.toString());
	    }.bind(this)
	});
    },
    handleDeckDropCard: function (deck, card) {
	$.ajax({
	    url: this.props.urlDeckDropCard,
	    data: {deck: deck, card: card},
	    dataType: "json",
	    type: "GET",
	    success: function (data) {
		this.setState({decks: data});
	    }.bind(this),
	    error: function (xhr, status, err) {
		console.error(this.props.urlDeckDropCard, status, err.toString());
	    }.bind(this)
	});
    },
    handleDeckSelection: function (deckAlias) {
	this.setState({deckShow: deckAlias});
    },
    handleDeckDel: function (deckAlias) {
	if (window.confirm("Supprimer le deck ? Cette action est irréversible.")) {
	    $.ajax({
		url: this.props.urlDeckDel,
		data: {deck: deckAlias},
		dataType: "json", type: "GET",
		success: function (data) {
		    this.setState({decks: data});
		}.bind(this),
		error: function (xhr, status, err) {
		    console.error(this.props.urlDeckDel, status, err.toString());
		}.bind(this)
	    });
	}
    },
    handleCardDel: function (cardAlias) {
	if (window.confirm("Supprimer la carte ? Elle sera aussi retirée des decks. Cette action est irréversible.")) {
	    $.ajax({
		url: this.props.urlCardDel,
		data: {card: cardAlias},
		dataType: "json", type: "GET",
		success: function (data) {
		    this.setState({cards: data.biblio, decks: data.decks});
		    if (this.state.cardInfo.alias == cardAlias) {
			this.setState({cardInfo: {alias: "", card: {}}});
		    }
		}.bind(this),
		error: function (xhr, status, err) {
		    console.error(this.props.urlCardDel, status, err.toString());
		}.bind(this)
	    });
	}
    },
    getInitialState: function () {
	return {"cards": {"set": {}, 
			  "lists": {"all": [], 
				    "tri": [],
				    "alphabetic": [],
				    "monster": [], 
				    "magic": [], 
				    "trap": []}, 
			  "nb": 0},
	        "decks": {"set": {}, "list": [], "nb": 0},
	        "cardInfo": {"alias": "", "card": {}},
		"deckShow": ""
	       };
    },
    componentDidMount: function () {
	this.loadData();
	setInterval(this.loadData, this.props.pollInterval);
    },
    render: function () {
	return (
	    <div className="doroBox" >
		<div className="colGauche" >
		    <BiblioBox cards = {this.state.cards}
		           handleCardSubmit = {this.handleCardSubmit}
		           handleClickCard = {this.handleClickCard} 
		           handleCardDel = {this.handleCardDel} />
		    <DecksBox decks = {this.state.decks} deckShow = {this.state.deckShow}
	                   handleDeckAddCard = {this.handleDeckAddCard}
		           handleDecksAddSubmit = {this.handleDecksAddSubmit} 
		           handleClickCard={this.handleClickCard} cards={this.state.cards} 
		           handleDeckSelection={this.handleDeckSelection} 
		           handleDeckDropCard={this.handleDeckDropCard} 
		           handleDeckDel={this.handleDeckDel} />
		</div>
		<CardInfoBox alias = {this.state.cardInfo.alias}
	                     card = {this.state.cardInfo.card} />
	    </div>
	);
    }
});

var port = window.location.port,
    address = "http://127.0.0.1:" + port;

React.render(
    <DoroBox
      urlBiblio = "biblio"
      urlBiblioAdd = "biblio-add"
      urlDecks = "decks"
      urlDecksAdd = "decks-add"
      urlDeckAddCard = "deck-add-card"
      urlDeckDropCard = "deck-drop-card"
      urlDeckDel = "deck-del"
      urlCardDel = "card-del"
      urlData = "data"
      pollInterval = {2000} />,
    document.getElementById("content")
);

}) ();