# npm-search

An index of npm using levelup.

## installation

``` 
#download all the json in npm (~350 mb in feb 2013)
./dl-npm-json.sh

#initialize db
node index.js

node search.js physic~ vox~
=>
{ 'voxel-control': [ [ 'PHYSICAL', 3 ], [ 'VOXEL', 5 ] ],
  'voxel-physical': [ [ 'PHYSICAL', 1 ], [ 'VOXEL', 1 ] ],
  'player-physics': [ [ 'PHYSICS', 6 ], [ 'VOXEL', 2 ], [ 'VOXELJS', 2 ] ],
  'voxel-player': [ [ 'PHYSICS', 2 ], [ 'VOXEL', 9 ], [ 'VOXELPLAYER', 2 ] ] }
```

Queries like that will take 200ms to 1000ms,
most of this time is spent opening the database.

If you want it to go really fast, open a server,
and then request to it.

```
node search.js --port 9876 &

# search terms seperated by /
curl localhost:9876/search/terms
```

If you end a search term with `~` then it will return
everthing that matches that prefix. 

```
node search.js stream~ err~
```

## todo

This is currently just a bunch of scripts.
Will polish this to make it a propper tool.

## license

MIT
