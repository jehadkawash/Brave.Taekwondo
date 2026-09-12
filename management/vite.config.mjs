import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({root:'management',envDir:process.cwd(),base:'/management/',plugins:[react()],build:{outDir:'../management-dist',emptyOutDir:true},server:{host:'127.0.0.1',port:5180}});
