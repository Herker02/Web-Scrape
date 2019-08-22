$(document).ready(function(){
    var articleContainer = $(".article-container");

    $(document).on("click", ".btn-delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage(){
        articleContainer.empty();
        $.get("/api/headline?saved=true").then(function(data){
            if(data && data.length){
                renderArticles(data);
            } else{
                renderEmpty();
            }
        });
    }

    function renderArticles(articles){
        var articlePanel = [];
        for(var i = 0;i<articles.length;i++){
            articlePanel.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanel);
    }

    function createPanel(article){
        var panel = 
        $(["<div class'panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class='btn btn-danger delete'>",
            "Delete from Saved",
            "</a>",
            "<a class='btn btn-info notes'>Article Notes</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
        ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    function renderEmpty(){
        $(["<div class='alert alert-warning text-center'>",
           "<h4>We don't have any saved articles.</h4>",
           "</div>",
           "<div class='panel panel-default'>",
           "<div class='panel-heading text-center'>",
           "<h3>Would you like to browse available Articles?</h3>",
           "</div>",
           "<h4><a href='/'>Browse Articles</a></h4>",
           "</div>",
           "</div>"
        ].join(""));
        articleContainer.append(emptyAlert);
    }

    function renderNoteList(data){
        var noteToRender = [];
        var currentNote;
        if(!data.note.length){
            currentNote = [
                "<li class='list-group-item'>",
                "No new notes for this Article yet.",
                "</li>"
            ].join("");
            noteToRender.push(currentNote);
        } else{
            for(var i=0; i < data.note.length; i++){
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.note[i].noteText,
                    "<button class='btn btn-danger note-delete'>X</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.note[i]._id);
                noteToRender.push(currentNote);
            }
        }
        $(".note-container").append(noteToRender);
    }

    function handleArticleDelete(){
        var artticleToDelete = $(this).parents(".panel").data();

        $.ajax({
            method:"DELETE",
            url:"/api/headline/" + artticleToDelete._id
        }).then(function(data){
            if(data.ok){
                initPage();
            }
        });
    }

    function handleArticleNotes(){
        var currentArticle = $(this).parents(".panel").data();

        $.get("/api/note/" + currentArticle._id).then(function(data){
            var modelText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class ='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
            ].join("");

            bootbox.dialog({
                message: modelText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                note: data || []
            };

            $(".btn.save").data("article", noteData);

            renderNoteList(noteData);
        });
    }

    function handleNoteSave(){
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        
        if(newNote){
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/note", noteData).then(function(){
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete(){
        var noteToDelete = $(this).data("_id");

        $.ajax({
            url: "/api/note/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            bootbox.hideAll();
        });
    }
});