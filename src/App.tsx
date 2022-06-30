import React, { useState } from 'react';
import './App.css';
import { PrintDialog } from './PrintDialog';
import { UploadFiles } from './UploadFiles';

function App() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="App">
      <UploadFiles choose={setFile}/>
      {!!file && <PrintDialog file={file} />}
    </div>
  );
}

export default App;
