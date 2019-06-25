import { ParseUrlHtml } from '../../../src/parseUrlHtml';
import { Transcript, TextSegment } from '../../../src/types';

import { HtmlFileTextOut } from '../../../src/htmlOutput';

async function inputHtml(sections?: string[]) {
  const transcript: Transcript = { segments: [] };
  let end: Array<TextSegment> = [];

  ParseUrlHtml.init('http://localhost:8081/');
  const htmlparse = require('html-parse');
  const tree = htmlparse.parse(`<body>
  <div id="preamble">
<div class="sectionbody">
<div id="toc" class="toc">
<div id="toctitle" class="title">Table of Contents</div>
<ul class="sectlevel0">
<li><a href="#_angular_ci">Angular CI</a>
<ul class="sectlevel1">
<li><a href="#_testing_links">TESTING LINKS</a></li>
<li><a href="#_pipeline">Pipeline</a></li>
<li><a href="#_adjustments">Adjustments</a>
<ul class="sectlevel2">
<li><a href="#_pipeline_environment">Pipeline Environment</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</div>
</div>
<h1 id="_angular_ci" class="sect0">Angular CI</h1>
<div class="sect1">
<h2 id="_testing_links">TESTING LINKS</h2>
<div class="sectionbody">
<div class="paragraph">
<p>refer to <a href="page1.html#bookmark-a">page1#bookmark-a</a> for more info</p>
</div>
<div class="paragraph">
<p>refer to <a href="page1.html#bookmark-a">page1.asciidoc#bookmark-a</a> for more info</p>
</div>
<div class="paragraph">
<p><a href="./page1">link:./page1</a></p>
</div>
<div class="paragraph">
<p><a href="./page1.asciidoc">link:./page1.asciidoc</a></p>
</div>
<div class="paragraph">
<p><a href="page1#Pipeline">link:page1#Pipeline</a></p>
</div>
<div class="paragraph">
<p>Xref page 1:</p>
</div>
<div class="paragraph">
<p><a href="#bookmark-a">xref:bookmark-a</a></p>
</div>
<div class="paragraph">
<p>Anchor to page 1:</p>
</div>
<div class="paragraph">
<p>Click on <a href="#adjustments-id">adjustments-id</a> to go to Adjustments</p>
</div>
<div class="paragraph">
<p>Links to page 2:</p>
</div>
<div class="paragraph">
<p><a href="./page2.asciidoc">link:./page2.asciidoc</a></p>
</div>
<div class="paragraph">
<p><a href="page2#basic-project-structure">link:page2#basic-project-structure</a></p>
</div>
<div class="paragraph">
<p>The Angular client-side of My Thai Star is going to have some specific needs for the CI-CD Pipeline to perform mandatory operations.</p>
</div>
<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 33.3333%;">
<col style="width: 33.3333%;">
<col style="width: 33.3334%;">
</colgroup>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">1</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">2</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">A</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">3</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">4</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">B</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">5</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">6</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">C</p></td>
</tr>
</tbody>
</table>
</div>
</div>
<div class="sect1">
<h2 id="_pipeline">Pipeline</h2>
<div class="sectionbody">
<div class="paragraph">
<p>The Pipeline for the Angular client-side is going to be called <strong>MyThaiStar_FRONTEND_BUILD</strong> . It is located in the PL instance, under the <a href="https://devon.s2-eu.capgemini.com/jenkins/job/MTS/">MTS folder</a> (as previously explained). It is going to follow a process flow like this one:</p>
</div>
<div class="paragraph">
<p><span class="image"><a class="image" href="angular_pipeline_flow.PNG"><img src="images/ci/angular/angular_pipeline_flow.PNG" alt="angular pipeline flow"></a></span></p>
</div>
<div class="paragraph">
<p>Each of those steps are called <em>stages</em> in the Jenkins context.Let&#8217;s see what those steps mean in the context of the Angular application:</p>
</div>
<div class="olist arabic">
<ol class="arabic">
<li>
<p><strong>Deliver application into Nexus</strong></p>
</li>
<li>
<p>Declarative: Post Actions</p>
</li>
</ol>
</div>
</div>
</div>
<div class="sect1">
<h2 id="_adjustments">Adjustments</h2>
<div class="sectionbody">
<div class="paragraph">
<p>The Angular project Pipeline needed some "extra" features to complete all planned processes. Those features resulted in some additions to the project.</p>
</div>
<div class="sect2">
<h3 id="_pipeline_environment">Pipeline Environment</h3>
<div class="paragraph">
<p>In order to easily reuse the pipeline in other angular projects, all variables have been defined in the block environment. All variables have the default values that Production Line uses, so if you&#8217;re going to work in production line you won&#8217;t have to change anything. Example:</p>
</div>
<div class="paragraph">
<p><span class="image"><a class="image" href="angular_directory.PNG"><img src="images/ci/angular/angular_directory.png" alt="angular directory"></a></span></p>
</div>
</div>
</div>
</div>
  </body>`);
  for (const branch of tree) {
    const temp = await ParseUrlHtml.recursive(branch);
    for (const final of temp) {
      end.push(final);
    }
  }
  //apply the filter
  if (sections !== undefined) {
    end = ParseUrlHtml.applyFilter(end, sections);
  }
  transcript.segments = end;
  //prepare the images to copy
  ParseUrlHtml.checkImagesList();
  //copy images
  if (ParseUrlHtml.arrayImagesSrc.length > 0) {
    for (const src of ParseUrlHtml.arrayImagesSrc) {
      await ParseUrlHtml.copyImage(src);
    }
  }

  const fileOutput = new HtmlFileTextOut('html-to-html');
  fileOutput.generate([transcript]);
}

inputHtml();

console.log('finished');