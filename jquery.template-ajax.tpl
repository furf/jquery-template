<h1>{%= this.name %}</h1>

{% function renderJob (job) { %}
  {% var verb = (job.end !== "present") ? "worked" : "currently work"; %}

  I {%= verb %} at <strong>{%= job.company %}</strong> as a <em>{%= job.position %}</em> {% renderDateRange(job.start, job.end) %}

  {% function renderDateRange (start, end) { %}
    from {%= start %} {%= end === "present" ? "" : "to " + end %}.
  {% } %}
{% } %}

<ul>
  {% for (var i = 0, n = this.jobs.length; i < n; ++i) { %}
    <li>{% renderJob(this.jobs[i]) %}</li>
  {% } %}
</ul>
