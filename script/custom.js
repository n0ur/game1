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
        $('td').text('');
        this.turn.play();
      },
      switchTurns: function() {
        this.turn = (this.turn == this.players[0] ? this.players[1] : this.players[0]); 
      },
      isFinished: function() {
        return  this.board.state.join().match(/-/g) === null ? true : false;
      },
      someoneWon: function(lastPoint, mark) {
        var lines = this.board.getLines(lastPoint);
        for(var i=0; i<lines.length; i++){
          if(this.board.hasMark(lines[i].point1, mark) && this.board.hasMark(lines[i].point2, mark) && this.board.hasMark(lines[i].point3, mark)) {
            return true;
          }
        }
        return false;
      },
      setMark: function(point, mark) {
        this.board.setMark(point, mark);
        if(this.someoneWon(point, mark)) {
          console.log("Someone won!");
        } else if (this.isFinished()) {
          console.log("Game finished!");
        } else {
          this.switchTurns();
          this.turn.play();
        }
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
        getLines: function(point) {
          var lines = [ new this.line([0,0], [1,1], [2,2]), // diagonal
          new this.line([0,2], [1,1], [2,0]), // diagonal
          new this.line([0,0], [0,1], [0,2]), // horizontal
          new this.line([1,0], [1,1], [1,2]), // horizontal
          new this.line([2,0], [2,1], [2,2]), // horizontal
          new this.line([0,0], [1,0], [2,0]), // vertical
          new this.line([0,1], [1,1], [2,1]), // vertical
          new this.line([0,2], [1,2], [2,2])];// vertical
          if (point !== undefined) {
            var linesWithPoint = [];
            for (var i=0; i<lines.length; i++) {
              if (lines[i].point1.isEqual(point) || lines[i].point2.isEqual(point) || lines[i].point3.isEqual(point)) {
                linesWithPoint.push(lines[i]);
              }
            }
            return linesWithPoint;
          }
          return lines;
        }
      }
    },
    HumanPlayer: function(mark){
      this.game = $tictactoe.game; 
      this.mark = mark;
      this.opponentMark = (this.mark === 'x' ? 'o' : 'x');
      var me = this;
      $('td').click(function() {
        var cellId = $(this).attr('id'), 
        row = parseInt(cellId.charAt(1)),
        col = parseInt(cellId.charAt(2));
        if (!me.canPlay) {
          return;
        }
        if (!me.game.board.hasMark([row, col], '-')) {
          return;
        } 
        me.canPlay = false;
        me.game.setMark([row,col], me.mark);
      });
      this.play = function(point) {
        this.canPlay = true;
      };
    },
    ComputerPlayer: function(mark){
      this.game = $tictactoe.game; 
      this.mark = mark;
      this.opponentMark = (this.mark === 'x' ? 'o' : 'x');
      this.hasMyMarkAt = function(point) {
        return this.game.board.hasMark(point, this.mark);
      };
      this.hasOppMarkAt = function(point) {
        return this.game.board.hasMark(point, this.opponentMark);
      };
      this.hasNothingAt = function(point) {
        return this.game.board.hasMark(point, '-');
      };
      this.play = function() {
        lines = this.game.board.getLines();
        for (var i=0; i<lines.length; i++) {
          switch(true) {
            // i am one move till winning
            case this.hasMyMarkAt(lines[i].point1) && this.hasMyMarkAt(lines[i].point2) && this.hasNothingAt(lines[i].point3):
              this.game.setMark(lines[i].point3,this.mark); return;
            case this.hasMyMarkAt(lines[i].point1) && this.hasMyMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point2):
              this.game.setMark(lines[i].point2,this.mark); return;
            case this.hasMyMarkAt(lines[i].point2) && this.hasMyMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point1):
              this.game.setMark(lines[i].point1,this.mark); return;
            // my opponent is one move till winning
            case this.hasOppMarkAt(lines[i].point1) && this.hasOppMarkAt(lines[i].point2) && this.hasNothingAt(lines[i].point3):
              this.game.setMark(lines[i].point3,this.mark); return;
            case this.hasOppMarkAt(lines[i].point1) && this.hasOppMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point2):
              this.game.setMark(lines[i].point2,this.mark); return;
            case this.hasOppMarkAt(lines[i].point2) && this.hasOppMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point1):
              this.game.setMark(lines[i].point1,this.mark); return;
          }
        }
        for (var i=0; i<lines.length; i++) {
          switch(true) {
            // there is only one mark
            case this.hasMyMarkAt(lines[i].point1) && this.hasNothingAt(lines[i].point2) && this.hasNothingAt(lines[i].point3):
              this.game.setMark(lines[i].point2,this.mark); return;
            case this.hasMyMarkAt(lines[i].point2) && this.hasNothingAt(lines[i].point1) && this.hasNothingAt(lines[i].point3):
              this.game.setMark(lines[i].point1,this.mark); return;
            case this.hasMyMarkAt(lines[i].point3) && this.hasNothingAt(lines[i].point1) && this.hasNothingAt(lines[i].point2):
              this.game.setMark(lines[i].point1,this.mark); return;
          }
        }
        for (var i=0; i<lines.length; i++) {
          switch(true) {
            //otherwise play where is empty
            case this.hasNothingAt(lines[i].point2):
              this.game.setMark(lines[i].point2,this.mark); return;
            case this.hasNothingAt(lines[i].point1):
              this.game.setMark(lines[i].point1,this.mark); return;
            case this.hasNothingAt(lines[i].point3):
              this.game.setMark(lines[i].point3,this.mark); return;
          }
        }            
      };
    }
  }
  Array.prototype.isEqual = function(arr) {
    if(this.length !== arr.length) {
      return false;
    } else {
      for(var i=0; i<this.length; i++){
        if(this[i] !== arr[i]) return false;
      }
    }
    return true;
  }
  $tictactoe.game.init(new $tictactoe.ComputerPlayer('x'), new $tictactoe.HumanPlayer('o'));
  $tictactoe.game.start();
});