const jsontoxml = require('jsontoxml');

class Serializer {
  #json(data) {
    return JSON.stringify(data);
  }

  #setXmlTag(data) {
    return { [this.tagSingular]: data };
  }

  #xml(data) {
    if (Array.isArray(data))
      data = { [this.tagPlural]: data.map((datum) => this.#setXmlTag(datum)) };
    else data = this.#setXmlTag(data);
    return jsontoxml(data);
  }

  serialize(data) {
    data = this.filter(data);
    if (this.contentType === 'application/xml') return this.#xml(data);
    return this.#json(data);
  }

  filterObject(object) {
    const filteredData = {};
    this.publicKeys.forEach((key) => {
      filteredData[key] = object[key];
    });
    return filteredData;
  }

  filter(data) {
    if (Array.isArray(data))
      data = data.map((datum) => this.filterObject(datum));
    else data = this.filterObject(data);
    return data;
  }
}

class SerializerTasks extends Serializer {
  constructor(contentType) {
    super();
    this.contentType = contentType;
    this.publicKeys = ['id', 'text'];
    this.tagPlural = 'Tasks';
    this.tagSingular = 'Task';
  }
}

class SerializerProjects extends Serializer {
  constructor(contentType) {
    super();
    this.contentType = contentType;
    this.publicKeys = ['id', 'name'];
    this.tagPlural = 'Projects';
    this.tagSingular = 'Project';
  }
}

class SerializerError extends Serializer {
  constructor(contentType) {
    super();
    this.contentType = contentType;
    this.publicKeys = ['message', 'id'];
    this.tagPlural = 'Errors';
    this.tagSingular = 'Error';
  }
}

module.exports = {
  Serializer,
  SerializerTasks,
  SerializerProjects,
  SerializerError,
  acceptedTypes: ['application/json', 'application/xml'],
};
