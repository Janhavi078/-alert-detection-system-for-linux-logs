const Insights = () => {
  return (
    <div className="p-4 text-center">
      <h2 className="mb-4">ML Detection Insights</h2>
      <div className="bg-secondary p-5 rounded">
        <p className="lead">The ML Service uses <strong>Isolation Forest</strong> to detect outliers in system logs[cite: 32, 67].</p>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-6 border-end">
            <h4>Anomalous Patterns</h4>
            <ul className="list-unstyled">
              <li>Multiple failed SSH attempts [cite: 47]</li>
              <li>Unauthorized IP spikes [cite: 107]</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h4>Detection Logic</h4>
            <p>Data is collected via Logstash, stored in Elasticsearch, and analyzed by Python FastAPI[cite: 30, 37, 38].</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;