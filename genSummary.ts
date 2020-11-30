import remark from 'remark';
import visit from 'unist-util-visit';
import vfile from 'to-vfile';

import { promises as fs } from 'fs';
import path from 'path';

const DIR = './';
const SUMMARY_TEMP = './SUMMARY.md.temp';
const SUMMARY = './SUMMARY.md.output';

function handleMdFiles(dir: string, template: string){

    let md_toc = '# Summary\n';
    fs.stat(dir).then( s => {
        if( s.isDirectory() ){ 

            fs.readdir(dir).then(d => {
                d.forEach( f => {
                    if ( path.parse(`${f}`).ext === ".md" && path.parse(`${f}`).name !== "SUMMARY" ) {
                        const index = `* [60 天通过 CCNA 考试](README.md)`
                    }
                });

                fs.writeFile(SUMMARY, `${data}${md_toc}`)
            })
        }
    })
}

let data: string;
fs.readFile(SUMMARY_TEMP).then((d) => {
    data = d.toString();
}).finally(() => {
    handleMdFiles(DIR, data)
})

