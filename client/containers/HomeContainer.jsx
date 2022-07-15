import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import BasicCard from '../components/BasicCard';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DoughnutChart from '../components/DoughnutChart';
import PieChart from '../components/PieChart';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import GaugeChartTemplate from '../components/GaugeChartTemplate'

export default function HomeContainer() {
  // For our drop down
  const [namespace, setNamespace] = React.useState('');
  const [cpu, setCpu] = useState(0);
  const [mem, setMem] = useState(0);

  const handleChange = (event) => {
    setNamespace(event.target.value);
  };
  
  const [nodesInfo, setNodesInfo] = useState([]);
  useEffect(() => {

    fetch('/api/k8s/podInfo')
    .then((response) => response.json())
    .then((data) => {
      
      data.forEach( (element, i) => {
        
        //for each node of nodesInfo
        const node = {};

        node.name = element.metadata.generateName;
        node.ip = element.status.podIP;
        //node.os = element.spec.nodeSelector['kubernetes.io/os'];
        node.os = 'Linux';
        //assign random color
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        node.color = `rgba(${r},${g},${b},1)`;
        node.key = {i};

        // nodesInfo.push(node);
        setNodesInfo((prev) => ([...prev,node]));
      })
    });

      console.log(nodesInfo);
      ////////////////////////////////////////////
      //---- FETCH REQ FOR THE 1ST SPEEDOMETER ---- CPU USAGE OF THE CLUSTER 
      ////// //////////////////////////////////
      fetch('http://localhost:8080/api/k8s/promClusterCpuPct')
      .then((response) => response.json())
      .then((data) => {
        setCpu(data);
      });

    ////////////////////////////////////////////
      //---- FETCH REQ FOR THE 2ND SPEEDOMETER ---- CPU MEMORY OF THE CLUSTER 
      ////// //////////////////////////////////
       fetch('http://localhost:8080/api/k8s/promClusterMemoryUtil')
       .then((response) => response.json())
       .then((data) => {
         setMem(data);
       });

},[])


  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Namespace</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={namespace}
            label='Namespace'
            onChange={handleChange}
          >
            <MenuItem value={10}>Namespace 1</MenuItem>
            <MenuItem value={20}>Namespace 2</MenuItem>
            <MenuItem value={30}>Namespace 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* <List sx={{ display: 'flex' }}>
        {nodesInfo.map((node) => (
          <ListItem>
            <BasicCard
              name={node.name}
              ip={node.ip}
              os={node.os}
              pods={node.pods}
              color={node.color}
            />
          </ListItem>
        ))}
      </List> */}
      <Grid container spacing={2} columns={4}>
        {nodesInfo.map((node) => (
            <Grid item xs={0.8}>
              <BasicCard
                name={node.name}
                ip={node.ip}
                os={node.os}
                color={node.color}
              />
            </Grid>

          ))}
      </Grid>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <GaugeChartTemplate
            chartData={Math.round(cpu * 100) / 100}
            title='Cluster CPU Usage'
            label='Cluster CPU Usage'
          />
        </Grid>
        <Grid item xs={6}>
        <GaugeChartTemplate
            chartData={Math.round(mem * 100) / 100}
            title='Cluster Memory Usage'
            label='Cluster Memory Usage'
          />
        </Grid>
      </Grid>
      
      
      {/* <DoughnutChart /> */}
    </>
  );
}
