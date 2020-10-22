<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  min-width: 1120px;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width : 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgb(182, 182, 182);
}
::-webkit-scrollbar-track {
  background: #ededed;
}

</style>
