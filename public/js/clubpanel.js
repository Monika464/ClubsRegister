console.log("witamy po stronie klienta");

//tu jest fetch adresu htto
//i wyglad strony

fetch("/clubs")
  .then((response) => response.json())
  .then((data) => {
    if (data.error) {
      console.log(data.error);
      //   messageOne.textContent = data.error;
      //   messageTwo.textContent = "";
      //   messageThree.textContent = "";
    } else {
      console.log("data".data);
      //messageThree.textContent = `Location: ${data.address}`;
      //alert(`Location: ${data.address}`);
      //   messageOne.textContent = "";
      //   messageTwo.textContent = `Weather: ${data.forecast}, Temperature: ${data.temperature}°C`;
      //   messageThree.textContent = `Location: ${data.location};`;

      //console.log("moon", data.forecast);
      //console.log("hej");
      // messageOne.textContent = "";
    }
  });
