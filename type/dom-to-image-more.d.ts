   declare module 'dom-to-image-more' {
     export interface Options {
       width?: number;
       height?: number;
       bgcolor?: string;
       style?: Record<string, any>;
       quality?: number;
     }
     
     export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
     export function toPng(node: HTMLElement, options?: Options): Promise<string>;
     export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
     export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
   }