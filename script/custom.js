$(document).ready(function () {

  var $tictactoe = {
    game: {
      players:[],
      init: function(player1, player2) {
        this.players.push(player1);
        this.players.push(player2);
        this.board.init(3);
        this.turn = this.players[0];
      },
      start: function() {
        while(!this.isFinished()) {
          this.turn.play();
          this.switchTurns();
        }
      },
      switchTurns: function() {
        this.turn = (this.turn == this.players[0] ? this.players[1] : this.players[0]); 
      },
      isFinished: function() {
        return this.board.state.join().match(/-/g) === null ? true : false;
      },
      board: {
        state: [],
        init: function(size) {
          this.size = size;
          for(var r=0; r<this.size; r++) {
            var subarr = [];
            for(var c=0; c<this.size; c++) { subarr.push('-'); }
            this.state.push(subarr);
          }  
        },
        setMark: function(point, mark) {
          this.state[point[0]][point[1]] = mark;
          $('td#c'+point.join().replace(',','')).text(mark);
        },
        hasMark:function(point, mark){
          return this.state[point[0]][point[1]] === mark;
        },
        isEmpty: function() {
          for(var r=0; r<this.size; r++) {
            for(var c=0; c<this.size; c++) { 
              if (this.state[r][c] !== '-') return false;
            }
          }
          return true;
        },
        line: function(p1, p2, p3) {
          this.point1 = p1;
          this.point2 = p2;
          this.point3 = p3;
        },
        getLines: function() {
          var lines = [ new this.line([0,0], [1,1], [2,2]), // diagonal
          new this.line([0,2], [1,1], [2,0]), // diagonal
          new this.line([0,0], [0,1], [0,2]), // horizontal
          new this.line([1,0], [1,1], [1,2]), // horizontal
          new this.line([2,0], [2,1], [2,2]), // horizontal
          new this.line([0,0], [1,0], [2,0]), // vertical
          new this.line([0,1], [1,1], [2,1]), // vertical
          new this.line([0,2], [1,2], [2,2])];// vertical
          return lines;
        }
      }
    },
    player: function(mark){
      this.game = $tictactoe.game; 
      this.mark = mark;
      this.opponentMark = (this.mark === 'x' ? 'o' : 'x');
    },
    HumanPlayer: function(mark){
      this.prototype = new $tictactoe.player(mark);
      this.play = function(point) {
        this.prototype.game.board.setMark(point, this.prototype.mark);
      };
    },
    ComputerPlayer: function(mark){
      this.prototype = new $tictactoe.player(mark);
      this.hasMyMarkAt = function(point) {
        return this.prototype.game.board.hasMark(point, this.prototype.mark);
      };
      this.hasOppMarkAt = function(point) {
        return this.prototype.game.board.hasMark(point, this.prototype.opponentMark);
      };
      this.hasNothingAt = function(point) {
        return this.prototype.game.board.hasMark(point, '-');
      };
      this.play = function() {
        lines = this.prototype.game.board.getLines();
        this.prototype.game.switchTurns();
        for (var i=0; i<lines.length; i++) {
          switch(true) {
            // i am one move till winning
            case this.hasMyMarkAt(lines[i].point1) && this.hasMyMarkAt(lines[i].point2) && this.hasNothingAt(lines[i].point3):
              this.prototype.game.board.setMark(lines[i].point3,this.prototype.mark); return;
            case this.hasMyMarkAt(lines[i].point1) && this.hasMyMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point2):
              this.prototype.game.board.setMark(lines[i].point2,this.prototype.mark); return;
            case this.hasMyMarkAt(lines[i].point2) && this.hasMyMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point1):
              this.prototype.game.board.setMark(lines[i].point1,this.prototype.mark); return;
            // my opponent is one move till winning
            case this.hasOppMarkAt(lines[i].point1) && this.hasOppMarkAt(lines[i].point2) && this.hasNothingAt(lines[i].point3):
              this.prototype.game.board.setMark(lines[i].point3,this.prototype.mark); return;
            case this.hasOppMarkAt(lines[i].point1) && this.hasOppMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point2):
              this.prototype.game.board.setMark(lines[i].point2,this.prototype.mark); return;
            case this.hasOppMarkAt(lines[i].point2) && this.hasOppMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point1):
              this.prototype.game.board.setMark(lines[i].point1,this.prototype.mark); return;
          }
        }
        for (var i=0; i<lines.length; i++) {
          switch(true) {
            // there is only one mark
            case this.hasMyMarkAt(lines[i].point1) && this.hasNothingAt(lines[i].point2) && this.hasNothingAt(lines[i].point3):
              this.prototype.game.board.setMark(lines[i].point2,this.prototype.mark); return;
            case this.hasMyMarkAt(lines[i].point2) && this.hasNothingAt(lines[i].point1) && this.hasNothingAt(lines[i].point3):
              this.prototype.game.board.setMark(lines[i].point1,this.prototype.mark); return;
            case this.hasMyMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point1) && this.hasNothingAt(lines[i].point2):
              this.prototype.game.board.setMark(lines[i].point1,this.prototype.mark); return;
          }
        }
        for (var i=0; i<lines.length; i++) {
          switch(true) {
            //otherwise play where is empty
            case this.hasNothingAt(lines[i].point2):
              this.prototype.game.board.setMark(lines[i].point2,this.prototype.mark); return;
            case this.hasNothingAt(lines[i].point1):
              this.prototype.game.board.setMark(lines[i].point1,this.prototype.mark); return;
            case this.hasNothingAt(lines[i].point3):
              this.prototype.game.board.setMark(lines[i].point3,this.prototype.mark); return;
          }
        }            
      };
    }
  }

  $tictactoe.game.init(new $tictactoe.ComputerPlayer('x'), new $tictactoe.ComputerPlayer('o'));
  // $tictactoe.game.start();
  $("#player1").click(function(){
    $tictactoe.game.turn.play();
  });
});

// if (this.turn == this.players[0]) {
//   // var that = this;
//   console.log("it's player0 turn");
//   // $('td#c00').click(function(){ that.turn.play([0,0]); });
//   // $('td#c01').click(function(){ that.turn.play([0,1]); });
//   // $('td#c02').click(function(){ that.turn.play([0,2]); });
//   // $('td#c10').click(function(){ that.turn.play([1,0]); });
//   // $('td#c11').click(function(){ that.turn.play([1,1]); });
//   // $('td#c12').click(function(){ that.turn.play([1,2]); });
//   // $('td#c20').click(function(){ that.turn.play([2,0]); });
//   // $('td#c21').click(function(){ that.turn.play([2,1]); });
//   // $('td#c22').click(function(){ that.turn.play([2,2]); });
// } else {
//   console.log("it's player1 turn");
//   this.turn.play();
// } 