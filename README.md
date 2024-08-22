# Pawn Structure Search

A web app made using React, Node.js, PostgreSQL and Tcl/Tk to study pawn structures in chess.

## Description

This project queries from a massive chess games database of over 13 million games based on 12 different pawn structures

- Benoni
- Carlsbad
- Closed Ruy Lopez
- Advanced French
- Hanging Pawns
- Isolated Queens Pawn
- King's Indian
- Maroczy Bind
- Sicilian
- Siclian with a white pawn on d5
- Slav
- Stonewall

The web app has a modal window for all structures which includes an image demonstrating the pawn structure, as well as a brief description on the structure and plans for both sides. <br/>

![Image containing IQP structure and plans for both sides](/frontend//public/readme_example1.PNG)

To query the database based on pawn structure and retrieve pgn files of games, the [tcscid](https://scidvspc.sourceforge.net/doc/progref.html) cli was used. A separate
PostgreSQL database is used to quickly retrieve game info(player names, elo and game result) to display to the table of games. This approach also has the added benefit of having the capability to carry out complex queries quickly.

### Analysis Board

In order to implement a fully functional analysis board that can branch off the main line and display any number of side lines, a tree data structure was used. This tree structure assumes the following is true:

- Each node in the tree represents a half-move, or [ply](https://www.chessprogramming.org/Ply). Additionally each node has an id which is a two element array, an array of children and other chess related information regarding the ply
- id[0] represents which variation the ply belongs to. id[1] represents the ply number **relative** to the variation. If a new variation is played id[1] would be 1.
- The root node represents the starting position and has an id of [1,0] and a parent set to null
- A tree holds the number of variations that have existed (Deleting a node does not decrease this number).
- The number of variations increases whenever a child is added to a node and the child is **not** the first in the children array

When reading from a pgn, the tree will initally only show the main line, since no analysis has been made. For example, given the pgn: 1. e4 e5 2. Nf3 Nc6 \* ,the corresponding tree would be:

![Diagram of tree with only main line](/frontend/public/tree_mainline.png)

If on the fourth ply, 2...Nf6 is played instead, the resulting pgn would be: 1. e4 e5 2. Nf3 Nc6 (2... Nf6) \*, with the corresponding tree being:

![Diagram of tree with sideline](/frontend/public/tree_mainline.png)
