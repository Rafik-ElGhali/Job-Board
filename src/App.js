import React, { useState,useEffect } from "react";
import { Box,Grid,ThemeProvider,Button,CircularProgress} from "@material-ui/core";
import theme from './theme/theme';
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import JobCard from './components/Job/JobCard'
import NewJobModel from "./components/Job/NewJobModel";
import {firestore,app} from './Firebase/config';
import { Close as CloseIcon} from '@material-ui/icons';
import ViewJobModel from "./components/Job/ViewJobModel";


// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [jobs,setJobs]=useState([]); //State to save data of jobs from firebase
  const [loading,setLoading]=useState(true); //state for the loader of the data
  const [customSearch,setCustomSearch]=useState(false); //State for the custom Search or Filter
  const [openModal,setOpenModal]=useState(false); //State for the Apply Job Modal
  const [viewJob,setViewJob]=useState({}); //State for the View or Check Job Modal

  const fetchJobs = async ()=>{
    setCustomSearch(false);
    setLoading(true);
    const req = await firestore
    .collection('jobs')
    .orderBy('postedOn','desc')
    .get();

    const tempData=req.docs.map((job)=>({ 
      ...job.data(),
      id : job.id,
      postedOn:job.data().postedOn.toDate(),
    }));

    setJobs(tempData);
    setLoading(false);
  }

  const fetchCustomJobs = async (jobSearch)=>{
    setLoading(true);
    setCustomSearch(true);
    const req = await firestore
    .collection('jobs')
    .orderBy('postedOn','desc')
    .where("location", "==" ,jobSearch.location)
    .where("type", "==" ,jobSearch.type)
    .get();

    const tempData=req.docs.map((job)=>({ 
      ...job.data(),
      id : job.id,
      postedOn:job.data().postedOn.toDate(),
    }));
    
    setJobs(tempData);
    setLoading(false);
  }

  const PostJob = async (jobDetails) => {
    await firestore.collection("jobs").add({
      ...jobDetails,
      postedOn:app.firestore.FieldValue.serverTimestamp()
    });
    fetchJobs();
  }

  useEffect(()=>{
    fetchJobs();
  },[]);

  return <ThemeProvider theme={theme}> 
    <Header openJobModel={()=>setOpenModal(true)}/>
    <NewJobModel 
      closeJobModel={()=>setOpenModal(false)} 
      openModal={openModal} 
      PostJob={PostJob} 
    />
    <ViewJobModel job={viewJob} closeModal={()=>setViewJob({})}/>
    <Box>
      <Grid container justify="center">
        <Grid item xs={10}>
          <SearchBar fetchCustomJobs={fetchCustomJobs} />

          {
            loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {customSearch && (   
                  <Box my={2} display="flex" justifyContent="flex-end">
                    <Button onClick={fetchJobs}>
                      <CloseIcon size={20} />
                      Custom Search                      
                    </Button>
                  </Box>
                )}
                {jobs.map((job)=> (
                   <JobCard open={()=>setViewJob(job)} key={job.id} {...job} />  
                ))}     
              </>
            )}
        </Grid>
      </Grid>
    </Box>
    
  </ThemeProvider>
};
