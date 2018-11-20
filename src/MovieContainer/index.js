import React, { Component } from 'react';
import CreateMovie from '../CreateMovie';
import MovieList from '../MovieList';
import EditMovie from '../EditMovie';
import { Grid } from 'semantic-ui-react';
import getCookie from 'js-cookie';


class MovieContainer extends Component {
  constructor(){
    super();

    this.state = {
      movies: [],
      movieToEdit: {
        title: '',
        description: '',
        id: ''
      },
      showEditModal: false
    }
  }
  //GET MOVIES
  getMovies = async () => {
    // Where We will make our fetch call to get all the movies
    // Where We will make our fetch call to get all the movies
    const csrfCookie = getCookie('csrftoken');
    const movies = await fetch('http://localhost:8000/movies/', {
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfCookie
      }
    });
    const moviesParsedJSON = await movies.json();
    return moviesParsedJSON
  }

  componentDidMount(){
    // get ALl the movies, on the intial load of the APP
    /// Where you call this.getMovies
    this.getMovies().then((movies)=> {
      if (movies.message === 'Must be logged in to see this data'){
        //alert('You must be logged in to view movies!!')
      } else {
        this.setState({
          movies: movies.data
        })
      }
    }).catch((err) => {
      console.log(err, 'this is the error')
    })
  }
  //CREATE
  addMovie = async (movie, e) => {
    // .bind arguments take presidence over every other argument
    e.preventDefault();
    console.log(movie);
    try {
      const csrfCookie = getCookie('csrftoken');
      console.log(typeof csrfCookie, csrfCookie, 'csrf token/cookie')
      const createdMovie = await fetch('http://localhost:8000/movies/', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie
        }
      });
      console.log(createdMovie)
      const parsedResponse = await createdMovie.json();
      console.log(parsedResponse, 'response')
      this.setState({movies: [...this.state.movies, parsedResponse.data]})

    } catch(err){
      console.log('error')
      console.log(err, 'this is the error')
    }
  }

  //DELETE
  deleteMovie = async (id) => {
    const csrfCookie = getCookie('csrftoken');
    console.log(typeof csrfCookie, csrfCookie, 'csrf token/cookie')
    const deletedMovie = await fetch('http://localhost:8000/movies/' + id + '/', {
      headers: {
        'X-CSRFToken': csrfCookie,
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      credentials: 'include'                              
    });    

    //This is the parsed response from the back end
    const deletedMovieParsed = await deletedMovie;
    console.log(deletedMovieParsed, 'deleted parsed movie')

    // Then make the delete request, then remove the movie from the state array using filter
    this.setState({
      movies: this.state.movies.filter((movie) => movie.id !== id )})
  }


  handleEditChange = (e) => {

    this.setState({
      movieToEdit: {
        ...this.state.movieToEdit,
        [e.currentTarget.name]: e.currentTarget.value
      }
    });    


    // movieToEdit: {
    //   _id: this.state.movieToEdit._id,
    //   title: this.state.movieToEdit.title,
    //   description: this.state.movieToEdit.description
    // }
  }
  closeAndEdit = async (e) => {
    e.preventDefault()
    try {
      const csrfCookie = getCookie('csrftoken');
      
      const editResponse = await fetch('http://localhost:8000/movies/' + this.state.movieToEdit.id + '/', {
        method: 'PUT',
        body: JSON.stringify({
          title: this.state.movieToEdit.title,
          description: this.state.movieToEdit.description
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie
        }
      });
      
      const editResponseParsed = await editResponse.json();
      
      const newEditedMovie = this.state.movies.map((movie) => {
        if(movie.id === editResponseParsed.data.id){
          movie = editResponseParsed.data
        }
        return movie        
      });

      this.setState({
        showEditModal: false,
        movies: newEditedMovie
      });            
    } catch(err) {
        console.log(err)
    }
  }
  openAndEdit = (movieFromTheList) => {
    console.log(movieFromTheList, ' movieToEdit  ');

    this.setState({
      showEditModal: true,
      movieToEdit: {
        ...movieFromTheList
      }
    })
  }
  render(){
    // console.log(this.state, 'this is state')
    return (
      <Grid columns={2} divided textAlign='center' style={{ height: '100%' }} verticalAlign='top' stackable>
        <Grid.Row>
          <Grid.Column>
            <CreateMovie addMovie={this.addMovie}/>
          </Grid.Column>

          <Grid.Column>
            <MovieList movies={this.state.movies} deleteMovie={this.deleteMovie} openAndEdit={this.openAndEdit}/>
          </Grid.Column>
          <EditMovie open={this.state.showEditModal} movieToEdit={this.state.movieToEdit} handleEditChange={this.handleEditChange} closeAndEdit={this.closeAndEdit}/>
        </Grid.Row>
      </Grid>
      )
  }
}

export default MovieContainer;
